export const runtime = 'nodejs'; // 👈 Fix: Avoid Edge function incompatibility with Prisma

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const user = await prisma.user.create({ data });
    return NextResponse.json(user);
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const prismaError = error as { code: string };
      if (prismaError.code === 'P2002') {
        return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
      }
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
