import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db/mongoose';
import { User } from '@/models/user';
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { tenantId, email, password } = await req.json();
  const user = await User.findOne({ tenantId, email }).lean();
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const payload = { tenantId, userId: user._id.toString(), role: user.role } as const;
  return NextResponse.json({
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload)
  });
}
