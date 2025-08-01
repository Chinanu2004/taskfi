// app/api/hirings/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const walletAddress = searchParams.get('walletAddress');
  const role = searchParams.get('role'); // 'hirer' or 'freelancer'

  if (!walletAddress || !role) {
    return NextResponse.json(
      { success: false, message: 'walletAddress and role are required' },
      { status: 400 }
    );
  }

  try {
    let profileId: number | null = null;

    if (role === 'hirer') {
      const hirerProfile = await prisma.hirerProfile.findFirst({
        where: { user: { walletAddress } }
      });
      if (!hirerProfile) throw new Error('Hirer not found');
      profileId = hirerProfile.id;
    } else {
      const freelancerProfile = await prisma.freelancerProfile.findFirst({
        where: { user: { walletAddress } }
      });
      if (!freelancerProfile) throw new Error('Freelancer not found');
      profileId = freelancerProfile.id;
    }

    const jobs = await prisma.job.findMany({
  where: role === 'hirer' ? { hirerId: profileId } : {},
  include: {
    category: true,
    hirer: { include: { user: true } },
    chats: true, // 👈 make sure this is here
  },
});

    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
