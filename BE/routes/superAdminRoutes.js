const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {
  requireRole,
  requirePermission,
  logAuditEvent,
  PERMISSIONS_CATALOG,
  ALL_PERMISSION_KEYS,
} = require('../middleware/authMiddleware');

const AdminApplication = require('../models/AdminApplication');
const AuditLog = require('../models/AuditLog');
const AdminNotification = require('../models/AdminNotification');
const PlatformSetting = require('../models/PlatformSetting');

module.exports = (authenticateToken, createSessionToken) => {
  const router = express.Router();
  const User = mongoose.model('User');
  const Session = mongoose.model('Session');

  // ==========================================
  // 1. SUPER ADMIN AUTHENTICATION
  // ==========================================

  /**
   * Dedicated Super Admin Login
   * Reuses identical tab-scoped session token infrastructure
   */
  router.post('/auth/login', async (req, res) => {
    try {
      const { identifier, password, tabId, forceReset } = req.body;
      if (!identifier || !password) {
        return res.status(400).json({ success: false, message: 'Identifier and password are required' });
      }

      const user = await User.findOne({
        $or: [
          { email: identifier.trim().toLowerCase() },
          { username: identifier.trim() },
        ],
      });

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // Check account suspension or deletion
      if (user.isDeleted || user.status === 'suspended') {
        return res.status(403).json({
          success: false,
          message: 'Your account has been suspended or deactivated.',
          code: 'ACCOUNT_SUSPENDED',
        });
      }

      // Strict role verification: ONLY superadmin accounts may enter
      if (user.role !== 'superadmin') {
        await logAuditEvent({
          actor: user,
          action: 'superadmin.unauthorized_login_attempt',
          targetEntity: 'SuperAdminPortal',
          reason: `User with role '${user.role}' attempted Super Admin login.`,
        });
        return res.status(403).json({
          success: false,
          message: 'Access denied: This portal is strictly restricted to Super Administrators.',
        });
      }

      const { token } = await createSessionToken(user._id, tabId, forceReset);

      user.lastLoginAt = new Date();
      await user.save();

      await logAuditEvent({
        actor: user,
        action: 'superadmin.login',
        targetEntity: 'SuperAdminPortal',
        reason: 'Super Admin successfully logged into platform console',
      });

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          name: user.name || '',
          email: user.email,
          role: user.role,
          permissions: user.permissions || [],
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      });
    } catch (err) {
      if (err.statusCode === 409) {
        return res.status(409).json({ success: false, message: err.message, code: err.code });
      }
      console.error('Super Admin Login Error:', err);
      return res.status(500).json({ success: false, message: 'Server error during Super Admin authentication' });
    }
  });

  // Guard all subsequent routes with authenticateToken and requireRole('superadmin')
  const superAdminOnly = [authenticateToken, requireRole('superadmin')];

  // ==========================================
  // 2. OVERVIEW DASHBOARD
  // ==========================================

  router.get('/overview', superAdminOnly, async (req, res) => {
    try {
      const now = new Date();
      const past24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const [
        totalDevelopers,
        totalAdmins,
        pendingApplications,
        activeAdmins,
        suspendedUsers,
        recentActionsCount,
        recentApplications,
        recentActivity,
      ] = await Promise.all([
        User.countDocuments({ role: 'user', isDeleted: false }),
        User.countDocuments({ role: 'admin', isDeleted: false }),
        AdminApplication.countDocuments({ status: 'pending' }),
        User.countDocuments({ role: 'admin', status: 'active', isDeleted: false }),
        User.countDocuments({ status: 'suspended', isDeleted: false }),
        AuditLog.countDocuments({ createdAt: { $gte: past24h } }),
        AdminApplication.find().sort({ createdAt: -1 }).limit(5),
        AuditLog.find().sort({ createdAt: -1 }).limit(10),
      ]);

      return res.status(200).json({
        success: true,
        stats: {
          totalDevelopers,
          totalAdmins,
          pendingApplications,
          activeAdmins,
          suspendedUsers,
          recentActionsCount,
        },
        recentApplications,
        recentActivity,
      });
    } catch (err) {
      console.error('Super Admin Overview Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch overview metrics' });
    }
  });

  // ==========================================
  // 3. ADMIN APPLICATION REVIEW
  // ==========================================

  router.get('/applications', superAdminOnly, async (req, res) => {
    try {
      const { status, search, page = 1, limit = 10 } = req.query;
      const query = {};

      if (status && status !== 'all') {
        query.status = status;
      }

      if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [{ fullName: searchRegex }, { email: searchRegex }];
      }

      const p = Math.max(1, parseInt(page, 10));
      const lim = Math.max(1, parseInt(limit, 10));

      const [applications, total, counts] = await Promise.all([
        AdminApplication.find(query)
          .sort({ createdAt: -1 })
          .skip((p - 1) * lim)
          .limit(lim)
          .populate('reviewedBy', 'name username email avatar'),
        AdminApplication.countDocuments(query),
        Promise.all([
          AdminApplication.countDocuments({}),
          AdminApplication.countDocuments({ status: 'pending' }),
          AdminApplication.countDocuments({ status: 'approved' }),
          AdminApplication.countDocuments({ status: 'rejected' }),
          AdminApplication.countDocuments({ status: 'info_requested' }),
        ]),
      ]);

      return res.status(200).json({
        success: true,
        applications,
        total,
        page: p,
        totalPages: Math.ceil(total / lim) || 1,
        counts: {
          all: counts[0],
          pending: counts[1],
          approved: counts[2],
          rejected: counts[3],
          info_requested: counts[4],
        },
      });
    } catch (err) {
      console.error('Fetch Applications Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch admin applications' });
    }
  });

  router.get('/applications/:id', superAdminOnly, async (req, res) => {
    try {
      const application = await AdminApplication.findById(req.params.id).populate(
        'reviewedBy',
        'name username email avatar'
      );
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      // Check if existing user account exists with this email
      const existingUser = await User.findOne({ email: application.email.toLowerCase(), isDeleted: false }).select(
        'name username email role status createdAt avatar points rank'
      );

      return res.status(200).json({
        success: true,
        application,
        existingUser,
      });
    } catch (err) {
      console.error('Fetch Single Application Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch application details' });
    }
  });

  router.post('/applications/:id/approve', superAdminOnly, async (req, res) => {
    try {
      const application = await AdminApplication.findById(req.params.id);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      if (application.status === 'approved') {
        return res.status(400).json({ success: false, message: 'Application is already approved' });
      }

      const { permissions } = req.body;
      const initialPermissions = Array.isArray(permissions) && permissions.length > 0
        ? permissions.filter((p) => ALL_PERMISSION_KEYS.includes(p))
        : ['challenge.create', 'challenge.edit', 'competition.create', 'reports.review', 'user.view'];

      // Find or promote user
      let user = await User.findOne({ email: application.email.toLowerCase() });
      if (user) {
        user.role = 'admin';
        user.status = 'active';
        user.permissions = initialPermissions;
        user.approvedAt = new Date();
        user.approvedBy = req.user._id;
        user.isDeleted = false;
        await user.save();
      } else {
        // Create an admin account placeholder with temporary activation
        const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(tempPassword, salt);
        const baseUsername = application.fullName.replace(/\s+/g, '_').toLowerCase().slice(0, 15) || 'admin';
        const uniqueSuffix = Math.floor(100 + Math.random() * 900);

        user = await User.create({
          name: application.fullName,
          username: `${baseUsername}_${uniqueSuffix}`,
          email: application.email.toLowerCase(),
          password: hashedPassword,
          phone: application.phone,
          role: 'admin',
          status: 'active',
          permissions: initialPermissions,
          approvedAt: new Date(),
          approvedBy: req.user._id,
        });
      }

      application.status = 'approved';
      application.reviewedBy = req.user._id;
      application.reviewedAt = new Date();
      application.existingUserId = user._id;
      await application.save();

      await logAuditEvent({
        actor: req.user,
        action: 'application.approved',
        targetEntity: 'AdminApplication',
        targetId: application._id,
        targetName: application.fullName,
        reason: 'Super Admin approved admin access',
        metadata: {
          applicantEmail: application.email,
          userId: user._id,
          grantedPermissions: initialPermissions,
        },
      });

      await AdminNotification.create({
        type: 'sensitive_action',
        title: 'Admin Application Approved',
        message: `${application.fullName} (${application.email}) was approved as Administrator by ${req.user.name || req.user.username}.`,
        targetId: String(application._id),
        targetEntity: 'AdminApplication',
      });

      return res.status(200).json({
        success: true,
        message: `Application approved successfully. User ${user.email} is now an Administrator.`,
        application,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          permissions: user.permissions,
        },
      });
    } catch (err) {
      console.error('Approve Application Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to approve application' });
    }
  });

  router.post('/applications/:id/reject', superAdminOnly, async (req, res) => {
    try {
      const { reason } = req.body;
      if (!reason || !reason.trim()) {
        return res.status(400).json({ success: false, message: 'A rejection reason is required.' });
      }

      const application = await AdminApplication.findById(req.params.id);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      application.status = 'rejected';
      application.rejectionReason = reason.trim();
      application.reviewedBy = req.user._id;
      application.reviewedAt = new Date();
      await application.save();

      await logAuditEvent({
        actor: req.user,
        action: 'application.rejected',
        targetEntity: 'AdminApplication',
        targetId: application._id,
        targetName: application.fullName,
        reason: reason.trim(),
        metadata: { applicantEmail: application.email },
      });

      return res.status(200).json({
        success: true,
        message: 'Application has been rejected and reason recorded.',
        application,
      });
    } catch (err) {
      console.error('Reject Application Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to reject application' });
    }
  });

  router.post('/applications/:id/request-info', superAdminOnly, async (req, res) => {
    try {
      const { message } = req.body;
      if (!message || !message.trim()) {
        return res.status(400).json({ success: false, message: 'A message describing requested info is required.' });
      }

      const application = await AdminApplication.findById(req.params.id);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      application.status = 'info_requested';
      application.requestedInfoMessage = message.trim();
      application.reviewedBy = req.user._id;
      application.reviewedAt = new Date();
      await application.save();

      await logAuditEvent({
        actor: req.user,
        action: 'application.info_requested',
        targetEntity: 'AdminApplication',
        targetId: application._id,
        targetName: application.fullName,
        reason: message.trim(),
        metadata: { applicantEmail: application.email },
      });

      return res.status(200).json({
        success: true,
        message: 'Applicant has been asked for more information.',
        application,
      });
    } catch (err) {
      console.error('Request Info Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to update application status' });
    }
  });

  // ==========================================
  // 4. ADMIN ACCOUNT MANAGEMENT
  // ==========================================

  router.get('/admins', superAdminOnly, async (req, res) => {
    try {
      const { search, status, page = 1, limit = 20 } = req.query;
      const query = { role: { $in: ['admin', 'superadmin'] }, isDeleted: false };

      if (status && status !== 'all') {
        query.status = status;
      }

      if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [{ name: searchRegex }, { username: searchRegex }, { email: searchRegex }];
      }

      const p = Math.max(1, parseInt(page, 10));
      const lim = Math.max(1, parseInt(limit, 10));

      const [admins, total] = await Promise.all([
        User.find(query)
          .sort({ role: -1, createdAt: -1 })
          .skip((p - 1) * lim)
          .limit(lim)
          .select('-password')
          .populate('approvedBy', 'name username email'),
        User.countDocuments(query),
      ]);

      return res.status(200).json({
        success: true,
        admins,
        total,
        page: p,
        totalPages: Math.ceil(total / lim) || 1,
      });
    } catch (err) {
      console.error('Fetch Admins Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch administrators' });
    }
  });

  router.post('/admins', superAdminOnly, async (req, res) => {
    try {
      const { email, username, name, password, permissions } = req.body;
      if (!email || !email.trim()) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }

      const safePermissions = Array.isArray(permissions)
        ? permissions.filter((p) => ALL_PERMISSION_KEYS.includes(p))
        : ['challenge.create', 'challenge.edit', 'competition.create', 'reports.review', 'user.view'];

      let existing = await User.findOne({ email: email.trim().toLowerCase() });
      if (existing) {
        if (existing.role === 'superadmin') {
          return res.status(400).json({ success: false, message: 'Account is already a Super Administrator.' });
        }
        existing.role = 'admin';
        existing.status = 'active';
        existing.isDeleted = false;
        existing.permissions = safePermissions;
        existing.approvedAt = new Date();
        existing.approvedBy = req.user._id;
        if (name) existing.name = name.trim();
        await existing.save();

        await logAuditEvent({
          actor: req.user,
          action: 'admin.promoted',
          targetEntity: 'User',
          targetId: existing._id,
          targetName: existing.name || existing.username,
          reason: 'Directly promoted existing user to Administrator',
          metadata: { email: existing.email, permissions: safePermissions },
        });

        return res.status(200).json({
          success: true,
          message: `Existing user ${existing.email} was successfully promoted to Administrator.`,
          admin: existing,
        });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({ success: false, message: 'A valid password with at least 6 characters is required for new accounts.' });
      }

      const finalUsername = (username && username.trim()) || email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
      const usernameExists = await User.findOne({ username: finalUsername });
      if (usernameExists) {
        return res.status(409).json({ success: false, message: 'Username is already taken. Please choose another.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newAdmin = await User.create({
        name: (name && name.trim()) || finalUsername,
        username: finalUsername,
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        permissions: safePermissions,
        approvedAt: new Date(),
        approvedBy: req.user._id,
      });

      await logAuditEvent({
        actor: req.user,
        action: 'admin.created',
        targetEntity: 'User',
        targetId: newAdmin._id,
        targetName: newAdmin.name || newAdmin.username,
        reason: 'Directly created new Administrator account',
        metadata: { email: newAdmin.email, permissions: safePermissions },
      });

      return res.status(201).json({
        success: true,
        message: `Administrator account for ${newAdmin.email} created successfully.`,
        admin: newAdmin,
      });
    } catch (err) {
      console.error('Create Admin Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to create administrator account' });
    }
  });

  router.get('/admins/:id', superAdminOnly, async (req, res) => {
    try {
      const admin = await User.findById(req.params.id)
        .select('-password')
        .populate('approvedBy', 'name username email');
      if (!admin || admin.isDeleted) {
        return res.status(404).json({ success: false, message: 'Administrator not found' });
      }

      const activity = await AuditLog.find({
        $or: [{ actorId: admin._id }, { targetId: String(admin._id) }],
      })
        .sort({ createdAt: -1 })
        .limit(15);

      return res.status(200).json({
        success: true,
        admin,
        activity,
      });
    } catch (err) {
      console.error('Fetch Admin Detail Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch administrator details' });
    }
  });

  router.patch('/admins/:id/status', superAdminOnly, async (req, res) => {
    try {
      const { status, reason } = req.body;
      if (!['active', 'suspended'].includes(status)) {
        return res.status(400).json({ success: false, message: "Status must be 'active' or 'suspended'" });
      }

      const targetAdmin = await User.findById(req.params.id);
      if (!targetAdmin) {
        return res.status(404).json({ success: false, message: 'Administrator not found' });
      }

      // Safeguard: Cannot suspend own account
      if (targetAdmin._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ success: false, message: 'You cannot alter the status of your own account.' });
      }

      // Safeguard: Cannot suspend other Super Admins
      if (targetAdmin.role === 'superadmin') {
        return res.status(403).json({ success: false, message: 'Super Administrator accounts cannot be suspended directly.' });
      }

      targetAdmin.status = status;
      targetAdmin.statusReason = reason || null;
      await targetAdmin.save();

      // If suspended, revoke all active sessions immediately
      if (status === 'suspended') {
        await Session.updateMany({ userId: targetAdmin._id, isRevoked: false }, { $set: { isRevoked: true } });
      }

      await logAuditEvent({
        actor: req.user,
        action: status === 'suspended' ? 'admin.suspended' : 'admin.restored',
        targetEntity: 'User',
        targetId: targetAdmin._id,
        targetName: targetAdmin.name || targetAdmin.username,
        reason: reason || null,
        metadata: { email: targetAdmin.email, status },
      });

      return res.status(200).json({
        success: true,
        message: `Administrator access ${status === 'suspended' ? 'suspended' : 'restored'} successfully.`,
        admin: targetAdmin,
      });
    } catch (err) {
      console.error('Update Admin Status Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to update administrator status' });
    }
  });

  router.delete('/admins/:id/role', superAdminOnly, async (req, res) => {
    try {
      const targetAdmin = await User.findById(req.params.id);
      if (!targetAdmin) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Safeguard: Cannot demote self
      if (targetAdmin._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ success: false, message: 'You cannot demote your own account.' });
      }

      // Safeguard: Cannot demote superadmin
      if (targetAdmin.role === 'superadmin') {
        return res.status(403).json({ success: false, message: 'Cannot demote a Super Administrator.' });
      }

      targetAdmin.role = 'user';
      targetAdmin.permissions = [];
      await targetAdmin.save();

      await logAuditEvent({
        actor: req.user,
        action: 'admin.demoted',
        targetEntity: 'User',
        targetId: targetAdmin._id,
        targetName: targetAdmin.name || targetAdmin.username,
        reason: req.body?.reason || 'Demoted back to standard developer role',
        metadata: { email: targetAdmin.email },
      });

      return res.status(200).json({
        success: true,
        message: `Admin privileges removed. ${targetAdmin.email} is now a standard developer.`,
      });
    } catch (err) {
      console.error('Demote Admin Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to remove admin role' });
    }
  });

  router.delete('/admins/:id', superAdminOnly, async (req, res) => {
    try {
      const { reason } = req.body;
      if (!reason || !reason.trim()) {
        return res.status(400).json({ success: false, message: 'A reason is required before deleting an admin account.' });
      }

      const targetAdmin = await User.findById(req.params.id);
      if (!targetAdmin) {
        return res.status(404).json({ success: false, message: 'Administrator not found' });
      }

      // Safeguards:
      if (targetAdmin._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ success: false, message: 'You cannot delete your own Super Admin account.' });
      }
      if (targetAdmin.role === 'superadmin') {
        return res.status(403).json({ success: false, message: 'Cannot delete a Super Administrator.' });
      }

      // Soft delete to preserve audit log references
      targetAdmin.isDeleted = true;
      targetAdmin.status = 'deactivated';
      targetAdmin.deletedAt = new Date();
      targetAdmin.deletedBy = req.user._id;
      targetAdmin.statusReason = reason.trim();
      await targetAdmin.save();

      // Revoke sessions
      await Session.updateMany({ userId: targetAdmin._id, isRevoked: false }, { $set: { isRevoked: true } });

      await logAuditEvent({
        actor: req.user,
        action: 'admin.deleted',
        targetEntity: 'User',
        targetId: targetAdmin._id,
        targetName: targetAdmin.name || targetAdmin.username,
        reason: reason.trim(),
        metadata: { email: targetAdmin.email },
      });

      return res.status(200).json({
        success: true,
        message: `Administrator account ${targetAdmin.email} has been deactivated and removed.`,
      });
    } catch (err) {
      console.error('Delete Admin Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete administrator account' });
    }
  });

  // ==========================================
  // 5. PERMISSION MANAGEMENT
  // ==========================================

  router.get('/permissions/catalog', superAdminOnly, async (req, res) => {
    return res.status(200).json({
      success: true,
      catalog: PERMISSIONS_CATALOG,
      allKeys: ALL_PERMISSION_KEYS,
    });
  });

  router.get('/permissions/:adminId', superAdminOnly, async (req, res) => {
    try {
      const admin = await User.findById(req.params.adminId).select('name username email role permissions status');
      if (!admin || admin.isDeleted) {
        return res.status(404).json({ success: false, message: 'Administrator not found' });
      }

      const history = await AuditLog.find({
        targetId: String(admin._id),
        action: 'admin.permissions_updated',
      })
        .sort({ createdAt: -1 })
        .limit(10);

      return res.status(200).json({
        success: true,
        admin,
        permissions: admin.permissions || [],
        history,
      });
    } catch (err) {
      console.error('Fetch Admin Permissions Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch admin permissions' });
    }
  });

  router.put('/permissions/:adminId', superAdminOnly, async (req, res) => {
    try {
      const { permissions, reason } = req.body;
      if (!Array.isArray(permissions)) {
        return res.status(400).json({ success: false, message: 'Permissions must be provided as an array.' });
      }

      const targetAdmin = await User.findById(req.params.adminId);
      if (!targetAdmin || targetAdmin.isDeleted) {
        return res.status(404).json({ success: false, message: 'Administrator not found' });
      }

      if (targetAdmin.role === 'superadmin') {
        return res.status(403).json({ success: false, message: 'Super Administrators hold full permissions by definition and cannot have them restricted.' });
      }

      // Filter against valid catalog strictly
      const validPermissions = permissions.filter((p) => ALL_PERMISSION_KEYS.includes(p));

      const oldPermissions = targetAdmin.permissions || [];
      const added = validPermissions.filter((p) => !oldPermissions.includes(p));
      const removed = oldPermissions.filter((p) => !validPermissions.includes(p));

      targetAdmin.permissions = validPermissions;
      await targetAdmin.save();

      await logAuditEvent({
        actor: req.user,
        action: 'admin.permissions_updated',
        targetEntity: 'User',
        targetId: targetAdmin._id,
        targetName: targetAdmin.name || targetAdmin.username,
        reason: reason || 'Super Admin updated assigned permissions',
        metadata: {
          adminEmail: targetAdmin.email,
          newPermissions: validPermissions,
          added,
          removed,
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Administrator permissions updated successfully.',
        permissions: targetAdmin.permissions,
        diff: { added, removed },
      });
    } catch (err) {
      console.error('Update Permissions Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to update administrator permissions' });
    }
  });

  // ==========================================
  // 6. USER MODERATION CONTROLS
  // ==========================================

  router.get('/users', superAdminOnly, async (req, res) => {
    try {
      const { search, status, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = req.query;
      const query = { role: 'user', isDeleted: false };

      if (status && status !== 'all') {
        query.status = status;
      }

      if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [{ name: searchRegex }, { username: searchRegex }, { email: searchRegex }];
      }

      const p = Math.max(1, parseInt(page, 10));
      const lim = Math.max(1, parseInt(limit, 10));
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const [users, total] = await Promise.all([
        User.find(query)
          .sort(sort)
          .skip((p - 1) * lim)
          .limit(lim)
          .select('-password'),
        User.countDocuments(query),
      ]);

      return res.status(200).json({
        success: true,
        users,
        total,
        page: p,
        totalPages: Math.ceil(total / lim) || 1,
      });
    } catch (err) {
      console.error('Fetch Users Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
  });

  router.get('/users/:id', superAdminOnly, async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const activity = await AuditLog.find({
        $or: [{ targetId: String(user._id) }, { actorId: user._id }],
      })
        .sort({ createdAt: -1 })
        .limit(10);

      return res.status(200).json({
        success: true,
        user,
        activity,
      });
    } catch (err) {
      console.error('Fetch User Detail Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch user details' });
    }
  });

  router.patch('/users/:id/status', superAdminOnly, async (req, res) => {
    try {
      const { status, reason } = req.body;
      if (!['active', 'suspended'].includes(status)) {
        return res.status(400).json({ success: false, message: "Status must be 'active' or 'suspended'" });
      }

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (user.role === 'superadmin') {
        return res.status(403).json({ success: false, message: 'Cannot suspend a Super Administrator.' });
      }

      user.status = status;
      user.statusReason = reason || null;
      await user.save();

      if (status === 'suspended') {
        await Session.updateMany({ userId: user._id, isRevoked: false }, { $set: { isRevoked: true } });
      }

      await logAuditEvent({
        actor: req.user,
        action: status === 'suspended' ? 'user.suspended' : 'user.restored',
        targetEntity: 'User',
        targetId: user._id,
        targetName: user.name || user.username,
        reason: reason || null,
        metadata: { email: user.email, status },
      });

      return res.status(200).json({
        success: true,
        message: `User account ${status === 'suspended' ? 'suspended' : 'restored'} successfully.`,
        user,
      });
    } catch (err) {
      console.error('Update User Status Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to update user status' });
    }
  });

  // User Deletion (Can be executed by Super Admin OR an Admin with explicit 'user.delete' permission)
  router.delete(
    '/users/:id',
    authenticateToken,
    requireRole('admin', 'superadmin'),
    requirePermission('user.delete'),
    async (req, res) => {
      try {
        const { reason } = req.body;
        if (!reason || !reason.trim()) {
          return res.status(400).json({ success: false, message: 'A reason is required before deleting a user account.' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.role === 'superadmin' || user._id.toString() === req.user._id.toString()) {
          return res.status(403).json({ success: false, message: 'Cannot delete this account.' });
        }

        // Soft deletion per governance requirement
        user.isDeleted = true;
        user.status = 'deactivated';
        user.statusReason = reason.trim();
        user.deletedAt = new Date();
        user.deletedBy = req.user._id;
        await user.save();

        await Session.updateMany({ userId: user._id, isRevoked: false }, { $set: { isRevoked: true } });

        await logAuditEvent({
          actor: req.user,
          action: 'user.deleted',
          targetEntity: 'User',
          targetId: user._id,
          targetName: user.name || user.username,
          reason: reason.trim(),
          metadata: { email: user.email, actorRole: req.user.role },
        });

        return res.status(200).json({
          success: true,
          message: `User account ${user.email} was deactivated and soft-deleted successfully.`,
        });
      } catch (err) {
        console.error('Delete User Error:', err);
        return res.status(500).json({ success: false, message: 'Failed to delete user account' });
      }
    }
  );

  // Quick Action: Grant or Revoke user.delete permission for an Admin
  router.post('/users/:adminId/grant-delete-permission', superAdminOnly, async (req, res) => {
    try {
      const { grant = true, reason } = req.body;
      const targetAdmin = await User.findById(req.params.adminId);
      if (!targetAdmin || targetAdmin.isDeleted) {
        return res.status(404).json({ success: false, message: 'Administrator not found' });
      }

      if (targetAdmin.role !== 'admin') {
        return res.status(400).json({ success: false, message: 'Target user is not an administrator.' });
      }

      let currentPerms = new Set(targetAdmin.permissions || []);
      if (grant) {
        currentPerms.add('user.delete');
      } else {
        currentPerms.delete('user.delete');
      }

      targetAdmin.permissions = Array.from(currentPerms);
      await targetAdmin.save();

      await logAuditEvent({
        actor: req.user,
        action: grant ? 'user.delete_permission_granted' : 'user.delete_permission_revoked',
        targetEntity: 'User',
        targetId: targetAdmin._id,
        targetName: targetAdmin.name || targetAdmin.username,
        reason: reason || (grant ? 'Granted user.delete permission' : 'Revoked user.delete permission'),
        metadata: { adminEmail: targetAdmin.email },
      });

      return res.status(200).json({
        success: true,
        message: `user.delete permission ${grant ? 'granted to' : 'revoked from'} ${targetAdmin.email}.`,
        permissions: targetAdmin.permissions,
      });
    } catch (err) {
      console.error('Grant Delete Permission Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to update user.delete permission' });
    }
  });

  // ==========================================
  // 7. AUDIT LOGS
  // ==========================================

  router.get('/audit-logs', superAdminOnly, async (req, res) => {
    try {
      const { search, action, targetEntity, actorRole, startDate, endDate, page = 1, limit = 20 } = req.query;
      const query = {};

      if (action && action !== 'all') {
        query.action = action;
      }
      if (targetEntity && targetEntity !== 'all') {
        query.targetEntity = targetEntity;
      }
      if (actorRole && actorRole !== 'all') {
        query.actorRole = actorRole;
      }
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }
      if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [
          { actorName: searchRegex },
          { targetName: searchRegex },
          { reason: searchRegex },
          { action: searchRegex },
        ];
      }

      const p = Math.max(1, parseInt(page, 10));
      const lim = Math.max(1, parseInt(limit, 10));

      const [logs, total, distinctActions] = await Promise.all([
        AuditLog.find(query)
          .sort({ createdAt: -1 })
          .skip((p - 1) * lim)
          .limit(lim),
        AuditLog.countDocuments(query),
        AuditLog.distinct('action'),
      ]);

      return res.status(200).json({
        success: true,
        logs,
        total,
        page: p,
        totalPages: Math.ceil(total / lim) || 1,
        distinctActions,
      });
    } catch (err) {
      console.error('Fetch Audit Logs Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch audit logs' });
    }
  });

  // ==========================================
  // 8. NOTIFICATIONS
  // ==========================================

  router.get('/notifications', superAdminOnly, async (req, res) => {
    try {
      const [notifications, unreadCount] = await Promise.all([
        AdminNotification.find().sort({ createdAt: -1 }).limit(25),
        AdminNotification.countDocuments({ isRead: false }),
      ]);

      return res.status(200).json({
        success: true,
        notifications,
        unreadCount,
      });
    } catch (err) {
      console.error('Fetch Notifications Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
    }
  });

  router.patch('/notifications/:id/read', superAdminOnly, async (req, res) => {
    try {
      await AdminNotification.findByIdAndUpdate(req.params.id, { isRead: true });
      return res.status(200).json({ success: true, message: 'Notification marked as read' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to update notification' });
    }
  });

  router.patch('/notifications/read-all', superAdminOnly, async (req, res) => {
    try {
      await AdminNotification.updateMany({ isRead: false }, { $set: { isRead: true } });
      return res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Failed to mark notifications as read' });
    }
  });

  // ==========================================
  // 9. PLATFORM SETTINGS
  // ==========================================

  router.get('/settings', superAdminOnly, async (req, res) => {
    try {
      const settings = await PlatformSetting.find().sort({ category: 1, key: 1 });

      // Default safe settings if collection is empty
      const defaultSettings = [
        { key: 'session_idle_timeout_min', value: 15, category: 'security', description: 'Session idle timeout in minutes' },
        { key: 'session_absolute_timeout_hr', value: 8, category: 'security', description: 'Absolute session expiry limit in hours' },
        { key: 'allow_admin_applications', value: true, category: 'administrative', description: 'Enable developer applications for admin roles' },
        { key: 'require_email_verification_for_review', value: true, category: 'administrative', description: 'Require email verification before application review' },
        { key: 'notify_on_new_applications', value: true, category: 'notifications', description: 'Send Super Admin notifications when new applications are submitted' },
        { key: 'notify_on_sensitive_actions', value: true, category: 'notifications', description: 'Alert administrators on account deletions and suspensions' },
      ];

      return res.status(200).json({
        success: true,
        settings: settings.length > 0 ? settings : defaultSettings,
      });
    } catch (err) {
      console.error('Fetch Settings Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch platform settings' });
    }
  });

  router.put('/settings', superAdminOnly, async (req, res) => {
    try {
      const { settings } = req.body;
      if (!Array.isArray(settings)) {
        return res.status(400).json({ success: false, message: 'Settings must be provided as an array.' });
      }

      for (const item of settings) {
        if (item.key) {
          await PlatformSetting.findOneAndUpdate(
            { key: item.key },
            {
              key: item.key,
              value: item.value,
              category: item.category || 'general',
              description: item.description || '',
              updatedBy: req.user._id,
              updatedAt: new Date(),
            },
            { upsert: true, new: true }
          );
        }
      }

      await logAuditEvent({
        actor: req.user,
        action: 'settings.updated',
        targetEntity: 'PlatformSetting',
        reason: 'Super Admin updated platform configuration',
      });

      return res.status(200).json({
        success: true,
        message: 'Platform settings saved successfully.',
      });
    } catch (err) {
      console.error('Update Settings Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to update platform settings' });
    }
  });

  return router;
};
