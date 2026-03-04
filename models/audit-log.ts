import { model, models, Schema } from 'mongoose';

const AuditSchema = new Schema({
  tenantId: { type: String, required: true, index: true },
  userId: String,
  module: { type: String, required: true },
  action: { type: String, required: true },
  recordId: String,
  metadata: Schema.Types.Mixed
}, { timestamps: true });

export const AuditLog = models.AuditLog || model('AuditLog', AuditSchema);
