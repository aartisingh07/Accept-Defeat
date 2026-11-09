const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    actorName: {
      type: String,
      default: 'System',
      trim: true,
    },
    actorRole: {
      type: String,
      enum: ['user', 'admin', 'superadmin', 'system'],
      default: 'system',
    },
    action: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    targetEntity: {
      type: String,
      required: true,
      trim: true,
    },
    targetId: {
      type: String,
      default: null,
      trim: true,
    },
    targetName: {
      type: String,
      default: null,
      trim: true,
    },
    reason: {
      type: String,
      default: null,
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
      index: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
