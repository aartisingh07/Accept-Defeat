const AuditLog = require('../models/AuditLog');

const PERMISSIONS_CATALOG = [
  {
    category: 'Challenge Management',
    description: 'Create, edit, delete, and publish platform challenges',
    permissions: [
      { key: 'challenge.create', label: 'Create Challenge', description: 'Create new competitive coding challenges' },
      { key: 'challenge.edit', label: 'Edit Challenge', description: 'Modify challenge description, test cases, and solutions' },
      { key: 'challenge.delete', label: 'Delete Challenge', description: 'Remove challenges from the platform' },
      { key: 'challenge.publish', label: 'Publish Challenge', description: 'Make draft challenges live for participants' },
      { key: 'challenge.manage_categories', label: 'Manage Challenge Categories', description: 'Organize tags, difficulty tiers, and topics' },
    ],
  },
  {
    category: 'Competition Management',
    description: 'Host and manage live hackathons and coding tournaments',
    permissions: [
      { key: 'competition.create', label: 'Create Competition', description: 'Create and schedule developer tournaments' },
      { key: 'competition.edit', label: 'Edit Competition', description: 'Update tournament rules, timeline, and reward pools' },
      { key: 'competition.delete', label: 'Delete Competition', description: 'Cancel and delete competitions' },
      { key: 'competition.manage_participants', label: 'Manage Participants', description: 'Review registrations and disqualify participants' },
    ],
  },
  {
    category: 'Community Moderation',
    description: 'Monitor community discussions, reports, and submitted content',
    permissions: [
      { key: 'reports.review', label: 'Review Reports', description: 'Inspect user reports regarding conduct and violations' },
      { key: 'content.flag', label: 'Flag Content', description: 'Flag suspicious or abusive submissions and discussions' },
      { key: 'comments.remove', label: 'Remove Comments', description: 'Delete inappropriate forum and battle comments' },
      { key: 'challenges.moderate', label: 'Moderate Community Challenges', description: 'Review user-created challenges before public release' },
    ],
  },
  {
    category: 'User Management',
    description: 'Moderate developer accounts and handle platform violations',
    permissions: [
      { key: 'user.view', label: 'View Users', description: 'Inspect developer profiles, activity logs, and submission records' },
      { key: 'user.flag', label: 'Flag Users', description: 'Place warnings or flags on suspicious accounts' },
      { key: 'user.suspend', label: 'Suspend Users', description: 'Temporarily lock accounts from accessing platform features' },
      { key: 'user.restore', label: 'Restore Suspended Users', description: 'Unlock suspended accounts and restore access' },
      { key: 'user.delete', label: 'Delete Users', description: 'Soft-delete or deactivate accounts (requires explicit Super Admin grant)' },
    ],
  },
  {
    category: 'Administrative Management',
    description: 'Monitor administrative operations across the platform',
    permissions: [
      { key: 'admin.activity.view', label: 'View Admin Activity', description: 'View administrative actions and audit history' },
    ],
  },
];

const ALL_PERMISSION_KEYS = PERMISSIONS_CATALOG.flatMap((cat) => cat.permissions.map((p) => p.key));

/**
 * Middleware: Verify that authenticated user has one of the required roles
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (req.user.status === 'suspended' || req.user.isDeleted) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended or deactivated.',
        code: 'ACCOUNT_SUSPENDED',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not have permission to perform this action.',
      });
    }

    next();
  };
};

/**
 * Middleware: Verify that user has specific granular permission
 * Super Admin implicitly has all permissions.
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (req.user.status === 'suspended' || req.user.isDeleted) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended or deactivated.',
        code: 'ACCOUNT_SUSPENDED',
      });
    }

    // Super Admin has unrestricted permissions
    if (req.user.role === 'superadmin') {
      return next();
    }

    // Admins must hold the explicit permission
    if (req.user.role === 'admin') {
      const userPermissions = Array.isArray(req.user.permissions) ? req.user.permissions : [];
      if (userPermissions.includes(permission)) {
        return next();
      }
      return res.status(403).json({
        success: false,
        message: `Access denied: Action requires the '${permission}' permission.`,
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied: Administrative privileges required.',
    });
  };
};

/**
 * Helper to write immutable Audit Logs
 */
const logAuditEvent = async ({ actor, action, targetEntity, targetId = null, targetName = null, reason = null, metadata = {} }) => {
  try {
    const actorId = actor?._id || actor?.id || null;
    const actorName = actor?.name || actor?.username || 'System';
    const actorRole = actor?.role || 'system';

    // Strip sensitive fields from metadata if any
    const safeMetadata = { ...metadata };
    delete safeMetadata.password;
    delete safeMetadata.token;
    delete safeMetadata.jwt;
    delete safeMetadata.secret;

    await AuditLog.create({
      actorId,
      actorName,
      actorRole,
      action,
      targetEntity,
      targetId: targetId ? String(targetId) : null,
      targetName: targetName ? String(targetName) : null,
      reason: reason || null,
      metadata: safeMetadata,
    });
  } catch (err) {
    console.error('Failed to log audit event:', err.message);
  }
};

module.exports = {
  PERMISSIONS_CATALOG,
  ALL_PERMISSION_KEYS,
  requireRole,
  requirePermission,
  logAuditEvent,
};
