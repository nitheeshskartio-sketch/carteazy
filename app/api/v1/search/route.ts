import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/mongoose';
import { getApiContext } from '@/lib/auth/jwt';
import { registry } from '@/models/modules';

export async function GET(req: NextRequest) {
  await dbConnect();
  const ctx = getApiContext(req);
  const query = new URL(req.url).searchParams.get('q') ?? '';
  const regex = { $regex: query, $options: 'i' };

  const [products, orders, customers] = await Promise.all([
    registry.products.find({ tenantId: ctx.tenantId, isDeleted: false, name: regex }).limit(5).lean(),
    registry.orders.find({ tenantId: ctx.tenantId, isDeleted: false, name: regex }).limit(5).lean(),
    registry.crm.find({ tenantId: ctx.tenantId, isDeleted: false, name: regex }).limit(5).lean()
  ]);

  return NextResponse.json({ products, orders, customers });
}
