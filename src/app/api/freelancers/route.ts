// app/api/freelancers/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all freelancers (for debugging or listing)
export async function GET() {
  try {
    const freelancers = await prisma.freelancerProfile.findMany({
      include: {
        user: true, // optional: shows wallet, name, role
      },
    });
    return NextResponse.json({ success: true, data: freelancers });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Error fetching freelancers' },
      { status: 500 }
    );
  }
}

// POST to create a freelancer profile
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, name, bio } = body;

    if (!userId || !name || !bio) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Make sure user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Update user name (optional but good for display)
    await prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    // 3. Check if freelancer profile already exists
    const existingProfile = await prisma.freelancerProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Freelancer profile already exists' },
        { status: 400 }
      );
    }

    // 4. Create freelancer profile
    const freelancer = await prisma.freelancerProfile.create({
      data: {
        userId,
        bio,
      },
    });

    return NextResponse.json({ success: true, data: freelancer }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create freelancer profile' },
      { status: 500 }
    );
  }
}
