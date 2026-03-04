import { model, models, Schema } from 'mongoose';
import { baseFields, withBaseOptions } from './base';

function createModuleSchema(extra: Record<string, any>) {
  const schema = new Schema({
    ...baseFields,
    name: { type: String, required: true, index: true },
    code: { type: String, index: true },
    status: { type: String, default: 'active', index: true },
    metadata: Schema.Types.Mixed,
    ...extra
  });
  withBaseOptions(schema);
  return schema;
}

export const Catalog = models.Catalog || model('Catalog', createModuleSchema({
  parentId: String,
  seo: { title: String, description: String },
  type: { type: String, default: 'category' }
}));

export const Product = models.Product || model('Product', createModuleSchema({
  catalogId: String,
  type: { type: String, enum: ['simple', 'variable', 'digital', 'service'], default: 'simple' },
  variants: [{ sku: String, attributes: Schema.Types.Mixed }],
  media: [String]
}));

export const Inventory = models.Inventory || model('Inventory', createModuleSchema({
  productId: String,
  warehouseId: String,
  quantity: { type: Number, default: 0 },
  lowStockThreshold: { type: Number, default: 5 }
}));

export const Pricing = models.Pricing || model('Pricing', createModuleSchema({
  productId: String,
  currency: { type: String, default: 'USD' },
  region: String,
  amount: Number,
  taxPercent: Number,
  discountPercent: Number
}));

export const Order = models.Order || model('Order', createModuleSchema({
  orderNo: { type: String, index: true },
  customerId: String,
  items: [{ productId: String, qty: Number, price: Number }],
  paymentStatus: { type: String, default: 'pending' },
  total: Number
}));

export const Logistics = models.Logistics || model('Logistics', createModuleSchema({
  orderId: String,
  provider: String,
  trackingNo: String,
  shipmentStatus: { type: String, default: 'created' }
}));

export const Crm = models.Crm || model('Crm', createModuleSchema({
  customerId: String,
  segment: String,
  notes: [String],
  lastContactAt: Date
}));

export const Support = models.Support || model('Support', createModuleSchema({
  customerId: String,
  orderId: String,
  priority: { type: String, default: 'medium' },
  slaAt: Date
}));

export const Booking = models.Booking || model('Booking', createModuleSchema({
  customerId: String,
  resourceId: String,
  startAt: Date,
  endAt: Date
}));

export const Finance = models.Finance || model('Finance', createModuleSchema({
  orderId: String,
  ledgerType: String,
  amount: Number,
  currency: String
}));

export const registry = {
  catalog: Catalog,
  products: Product,
  inventory: Inventory,
  pricing: Pricing,
  orders: Order,
  logistics: Logistics,
  crm: Crm,
  support: Support,
  booking: Booking,
  finance: Finance
} as const;

export type RegistryKey = keyof typeof registry;
