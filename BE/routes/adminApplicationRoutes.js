const express = require('express');
const mongoose = require('mongoose');
const AdminApplication = require('../models/AdminApplication');
const AdminNotification = require('../models/AdminNotification');
const { logAuditEvent } = require('../middleware/authMiddleware');

module.exports = () => {
  const router = express.Router();
  const User = mongoose.model('User');

  /**
   * Public Admin Application Submission
   * POST /api/admin/apply
   */
  router.post('/apply', async (req, res) => {
    try {
      const { fullName, email, phone, reason, experience, linkedinUrl, githubUrl } = req.body;

      if (!fullName || !fullName.trim()) {
        return res.status(400).json({ success: false, message: 'Full name is required' });
      }
      if (!email || !email.trim()) {
        return res.status(400).json({ success: false, message: 'Email address is required' });
      }
      if (!phone || !phone.trim()) {
        return res.status(400).json({ success: false, message: 'Phone number is required' });
      }
      if (!reason || !reason.trim()) {
        return res.status(400).json({ success: false, message: 'Reason for requesting Admin access is required' });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Check if user is already an admin or superadmin
      const existingUser = await User.findOne({ email: normalizedEmail, isDeleted: false });
      if (existingUser && ['admin', 'superadmin'].includes(existingUser.role)) {
        return res.status(400).json({
          success: false,
          message: 'An administrative account with this email address already exists.',
        });
      }

      // Check if there is an existing pending or info_requested application
      const activeApplication = await AdminApplication.findOne({
        email: normalizedEmail,
        status: { $in: ['pending', 'info_requested'] },
      });

      if (activeApplication) {
        return res.status(409).json({
          success: false,
          message:
            activeApplication.status === 'info_requested'
              ? 'You have an application where additional information was requested. Please respond to that request.'
              : 'You already have an active application currently under review.',
          applicationId: activeApplication._id,
          status: activeApplication.status,
        });
      }

      const application = await AdminApplication.create({
        fullName: fullName.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        reason: reason.trim(),
        experience: experience ? experience.trim() : '',
        linkedinUrl: linkedinUrl ? linkedinUrl.trim() : '',
        githubUrl: githubUrl ? githubUrl.trim() : '',
        emailVerified: true,
        existingUserId: existingUser ? existingUser._id : null,
      });

      // Notify Super Admins
      await AdminNotification.create({
        type: 'application_submitted',
        title: 'New Admin Application',
        message: `${application.fullName} (${application.email}) has submitted an application for the Administrator role.`,
        targetId: String(application._id),
        targetEntity: 'AdminApplication',
      });

      // Audit Log
      await logAuditEvent({
        actor: existingUser || { name: application.fullName, username: application.email, role: 'user' },
        action: 'application.submitted',
        targetEntity: 'AdminApplication',
        targetId: application._id,
        targetName: application.fullName,
        reason: 'Applicant submitted Admin Application via public portal',
        metadata: { email: application.email },
      });

      return res.status(201).json({
        success: true,
        message: 'Your application has been received and is now pending review by the Super Administrator.',
        application: {
          id: application._id,
          fullName: application.fullName,
          email: application.email,
          status: application.status,
          createdAt: application.createdAt,
        },
      });
    } catch (err) {
      console.error('Submit Admin Application Error:', err);
      return res.status(500).json({ success: false, message: 'Server error while submitting application' });
    }
  });

  /**
   * Applicant Response to "More Info Requested"
   * POST /api/admin/applications/:id/respond
   */
  router.post('/applications/:id/respond', async (req, res) => {
    try {
      const { response } = req.body;
      if (!response || !response.trim()) {
        return res.status(400).json({ success: false, message: 'Response content is required' });
      }

      const application = await AdminApplication.findById(req.params.id);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      if (application.status !== 'info_requested') {
        return res.status(400).json({
          success: false,
          message: `Cannot provide additional information for an application with status '${application.status}'`,
        });
      }

      application.applicantResponse = response.trim();
      application.applicantResponseDate = new Date();
      application.status = 'pending'; // Re-queued for review
      await application.save();

      await AdminNotification.create({
        type: 'info_responded',
        title: 'Applicant Provided More Information',
        message: `${application.fullName} (${application.email}) responded to your request for more information.`,
        targetId: String(application._id),
        targetEntity: 'AdminApplication',
      });

      await logAuditEvent({
        actor: { name: application.fullName, username: application.email, role: 'user' },
        action: 'application.info_responded',
        targetEntity: 'AdminApplication',
        targetId: application._id,
        targetName: application.fullName,
        reason: 'Applicant responded with requested information',
      });

      return res.status(200).json({
        success: true,
        message: 'Your response was submitted successfully. The Super Administrator will continue reviewing your application.',
      });
    } catch (err) {
      console.error('Respond to Info Request Error:', err);
      return res.status(500).json({ success: false, message: 'Server error while submitting response' });
    }
  });

  return router;
};
