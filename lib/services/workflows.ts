import { eventBus } from '@/lib/events/bus';
import { Crm, Finance, Inventory, Logistics } from '@/models/modules';

let initialized = false;

export function initWorkflows() {
  if (initialized) return;
  initialized = true;

  eventBus.on('order.placed', async (payload: any) => {
    const { tenantId, orderId, customerId, items, total } = payload;

    for (const item of items) {
      await Inventory.findOneAndUpdate(
        { tenantId, productId: item.productId, isDeleted: false },
        { $inc: { quantity: -Math.abs(item.qty) } },
        { upsert: true }
      );
    }

    await Finance.create({ tenantId, name: `Order ${orderId}`, orderId, amount: total, ledgerType: 'revenue', currency: 'USD' });
    await Crm.create({ tenantId, name: `Order activity ${orderId}`, customerId, segment: 'buyer' });
    await Logistics.create({ tenantId, name: `Shipment ${orderId}`, orderId, provider: 'TBD' });
  });
}
