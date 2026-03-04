import { NextRequest, NextResponse } from 'next/server';
import { getModule, removeModule, updateModule } from '@/lib/api/crud';
import { registry, type RegistryKey } from '@/models/modules';

function asModule(module: string): RegistryKey | null {
  return module in registry ? (module as RegistryKey) : null;
}

export async function GET(req: NextRequest, { params }: { params: { module: string; id: string } }) {
  const key = asModule(params.module);
  if (!key) return NextResponse.json({ error: 'Invalid module' }, { status: 404 });
  return getModule(req, key, params.id);
}

export async function PATCH(req: NextRequest, { params }: { params: { module: string; id: string } }) {
  const key = asModule(params.module);
  if (!key) return NextResponse.json({ error: 'Invalid module' }, { status: 404 });
  return updateModule(req, key, params.id);
}

export async function DELETE(req: NextRequest, { params }: { params: { module: string; id: string } }) {
  const key = asModule(params.module);
  if (!key) return NextResponse.json({ error: 'Invalid module' }, { status: 404 });
  return removeModule(req, key, params.id);
}
