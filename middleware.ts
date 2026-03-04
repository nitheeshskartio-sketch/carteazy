import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const hits = new Map<string, { count: number; ts: number }>();

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/api/')) return NextResponse.next();

  const ip = req.ip ?? 'local';
  const now = Date.now();
  const record = hits.get(ip);
  const windowMs = 60_000;
  const max = 300;

  if (!record || now - record.ts > windowMs) {
    hits.set(ip, { count: 1, ts: now });
  } else {
    record.count += 1;
    if (record.count > max) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
  }

  const requestHeaders = new Headers(req.headers);
  if (!requestHeaders.get('x-tenant-id')) {
    requestHeaders.set('x-tenant-id', 'public');
  }

  return NextResponse.next({
    request: { headers: requestHeaders }
  });
}

export const config = {
  matcher: ['/api/:path*']
};
