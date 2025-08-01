// /app/api/hirer/applications/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET handler: For query string like ?hirerId=1
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const hirerId = parseInt(searchParams.get('hirerId') || '');

  if (!hirerId) {
    return NextResponse.json({ error: 'Hirer ID is required' }, { status: 400 });
  }

  try {
    const applications = await prisma.jobApplication.findMany({
      where: {
        job: {
          hirerId: hirerId,
        },
      },
      include: {
        job: true,
        freelancer: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

// POST handler: For JSON body { "hirerId": 1 }
export async function POST(req: Request) {
  try {
    const { hirerId } = await req.json();

    if (!hirerId) {
      return NextResponse.json({ error: 'Hirer ID is required' }, { status: 400 });
    }

    const applications = await prisma.jobApplication.findMany({
      where: {
        job: {
          hirerId: hirerId,
        },
      },
      include: {
        job: true,
        freelancer: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
