import { model, models, Schema } from 'mongoose';

const UserSchema = new Schema({
  tenantId: { type: String, required: true, index: true },
  email: { type: String, required: true },
  name: String,
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'manager' }
}, { timestamps: true });

UserSchema.index({ tenantId: 1, email: 1 }, { unique: true });

export const User = models.User || model('User', UserSchema);
