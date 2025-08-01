// /app/api/user/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.walletAddress) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { walletAddress: session.user.walletAddress },
    include: {
      freelancer: {
        include: { categories: true }
      },
      hirer: true
    }
  });

  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.walletAddress) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();

  const user = await prisma.user.update({
    where: { walletAddress: session.user.walletAddress },
    data: {
      name: data.name || undefined,
      profileImage: data.profileImage || undefined,
      ...(data.bio && {
        freelancer: { update: { bio: data.bio } }
      }),
      ...(data.categories && {
        freelancer: {
          update: {
            categories: {
              set: [],
              connect: data.categories.map((id: number) => ({ id }))
            }
          }
        }
      })
    }
  });

  return NextResponse.json({ success: true, user });
}
