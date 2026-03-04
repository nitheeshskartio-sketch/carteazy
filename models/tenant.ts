import { model, models, Schema } from 'mongoose';

const TenantSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  subscriptionPlan: { type: String, default: 'starter' },
  usage: {
    orders: { type: Number, default: 0 },
    storageGb: { type: Number, default: 0 }
  }
}, { timestamps: true });

export const Tenant = models.Tenant || model('Tenant', TenantSchema);
