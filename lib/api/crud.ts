import { NextRequest, NextResponse } from 'next/server';
import { FilterQuery } from 'mongoose';
import { AuditLog } from '@/models/audit-log';
import { dbConnect } from '@/lib/db/mongoose';
import { getApiContext } from '@/lib/auth/jwt';
import { hasPermission } from '@/lib/rbac/permissions';
import { registry, type RegistryKey } from '@/models/modules';

function parseCursor(cursor?: string) {
  if (!cursor) return undefined;
  return { _id: { $lt: cursor } };
}

export async function listModule(req: NextRequest, moduleKey: RegistryKey) {
  await dbConnect();
  const ctx = getApiContext(req);
  const model = registry[moduleKey];
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit') ?? 20);
  const search = searchParams.get('search');
  const status = searchParams.get('status');
  const cursor = searchParams.get('cursor') ?? undefined;

  const filter: FilterQuery<any> = { tenantId: ctx.tenantId, isDeleted: false, ...parseCursor(cursor) };
  if (status) filter.status = status;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const items = await model.find(filter).sort({ _id: -1 }).limit(limit + 1).lean();
  const hasMore = items.length > limit;
  const result = hasMore ? items.slice(0, -1) : items;

  return NextResponse.json({ items: result, nextCursor: hasMore ? result.at(-1)?._id : null });
}

export async function createModule(req: NextRequest, moduleKey: RegistryKey) {
  await dbConnect();
  const ctx = getApiContext(req);
  if (!hasPermission(ctx.role, 'manager')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const model = registry[moduleKey];
  const body = await req.json();
  const created = await model.create({ ...body, tenantId: ctx.tenantId, createdBy: ctx.userId, updatedBy: ctx.userId });
  await AuditLog.create({ tenantId: ctx.tenantId, userId: ctx.userId, module: moduleKey, action: 'create', recordId: created._id.toString() });

  return NextResponse.json(created, { status: 201 });
}

export async function getModule(req: NextRequest, moduleKey: RegistryKey, id: string) {
  await dbConnect();
  const ctx = getApiContext(req);
  const item = await registry[moduleKey].findOne({ _id: id, tenantId: ctx.tenantId, isDeleted: false }).lean();
  return item ? NextResponse.json(item) : NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function updateModule(req: NextRequest, moduleKey: RegistryKey, id: string) {
  await dbConnect();
  const ctx = getApiContext(req);
  if (!hasPermission(ctx.role, 'manager')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const updated = await registry[moduleKey].findOneAndUpdate(
    { _id: id, tenantId: ctx.tenantId, isDeleted: false },
    { ...body, updatedBy: ctx.userId },
    { new: true }
  ).lean();

  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await AuditLog.create({ tenantId: ctx.tenantId, userId: ctx.userId, module: moduleKey, action: 'update', recordId: id });
  return NextResponse.json(updated);
}

export async function removeModule(req: NextRequest, moduleKey: RegistryKey, id: string) {
  await dbConnect();
  const ctx = getApiContext(req);
  if (!hasPermission(ctx.role, 'tenant_admin')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const removed = await registry[moduleKey].findOneAndUpdate(
    { _id: id, tenantId: ctx.tenantId, isDeleted: false },
    { isDeleted: true, updatedBy: ctx.userId },
    { new: true }
  ).lean();

  if (!removed) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await AuditLog.create({ tenantId: ctx.tenantId, userId: ctx.userId, module: moduleKey, action: 'delete', recordId: id });
  return NextResponse.json({ ok: true });
}
