import { NextRequest, NextResponse } from 'next/server';
import { createModule, listModule } from '@/lib/api/crud';
import { registry, type RegistryKey } from '@/models/modules';
import { initWorkflows } from '@/lib/services/workflows';
import { eventBus } from '@/lib/events/bus';
import { getApiContext } from '@/lib/auth/jwt';

function asModule(module: string): RegistryKey | null {
  return module in registry ? (module as RegistryKey) : null;
}

export async function GET(req: NextRequest, { params }: { params: { module: string } }) {
  const key = asModule(params.module);
  if (!key) return NextResponse.json({ error: 'Invalid module' }, { status: 404 });
  return listModule(req, key);
}

export async function POST(req: NextRequest, { params }: { params: { module: string } }) {
  const key = asModule(params.module);
  if (!key) return NextResponse.json({ error: 'Invalid module' }, { status: 404 });

  initWorkflows();
  const response = await createModule(req, key);

  if (key === 'orders' && response.status === 201) {
    const body = await response.clone().json();
    const ctx = getApiContext(req);
    await eventBus.emit('order.placed', {
      tenantId: ctx.tenantId,
      orderId: body._id,
      customerId: body.customerId,
      items: body.items ?? [],
      total: body.total ?? 0
    });
  }

  return response;
}
