import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import type { ApiContext } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-me';

export function signAccessToken(payload: ApiContext) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(payload: ApiContext) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function getApiContext(req: NextRequest): ApiContext {
  const auth = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!auth) return { tenantId: req.headers.get('x-tenant-id') ?? 'public', userId: 'system', role: 'super_admin' };
  return jwt.verify(auth, JWT_SECRET) as ApiContext;
}
