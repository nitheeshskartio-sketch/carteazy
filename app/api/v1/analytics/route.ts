import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { getApiContext } from '@/lib/auth/jwt';
import { registry } from '@/models/modules';

export async function GET(req: NextRequest) {
  await dbConnect();
  const ctx = getApiContext(req);

  const [orders, revenue, products, lowStock] = await Promise.all([
    registry.orders.countDocuments({ tenantId: ctx.tenantId, isDeleted: false }),
    registry.finance.aggregate([{ $match: { tenantId: ctx.tenantId, isDeleted: false } }, { $group: { _id: null, sum: { $sum: '$amount' } } }]),
    registry.products.countDocuments({ tenantId: ctx.tenantId, isDeleted: false }),
    registry.inventory.countDocuments({ tenantId: ctx.tenantId, isDeleted: false, $expr: { $lte: ['$quantity', '$lowStockThreshold'] } })
  ]);

  return NextResponse.json({
    orders,
    revenue: revenue[0]?.sum ?? 0,
    products,
    lowStock
  });
}
