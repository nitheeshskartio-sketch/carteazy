import { Schema } from 'mongoose';

export const baseFields = {
  tenantId: { type: String, required: true, index: true },
  isDeleted: { type: Boolean, default: false, index: true },
  createdBy: { type: String },
  updatedBy: { type: String }
};

export function withBaseOptions(schema: Schema) {
  schema.set('timestamps', true);
  schema.index({ tenantId: 1, createdAt: -1 });
  schema.index({ tenantId: 1, isDeleted: 1 });
}
