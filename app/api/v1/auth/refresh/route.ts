import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { signAccessToken } from '@/lib/auth/jwt';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-me';

export async function POST(req: NextRequest) {
  const { refreshToken } = await req.json();
  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET) as { tenantId: string; userId: string; role: any };
    return NextResponse.json({ accessToken: signAccessToken(payload) });
  } catch {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }
}
