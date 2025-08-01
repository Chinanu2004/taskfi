// src/app/api/user/by-wallet/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { walletAddress } = await req.json();

  if (!walletAddress) {
    return NextResponse.json({ success: false, message: 'Missing walletAddress' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { walletAddress },
    select: {
      id: true,
      walletAddress: true,
      profileImage: true,
      freelancer: {
        select: { bio: true }
      }
    },
  });

  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, user });
}
