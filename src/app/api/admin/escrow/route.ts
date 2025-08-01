import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const approvedJobs = await prisma.jobApplication.findMany({
      where: {
        status: 'accepted',
        completionStatus: 'approved',
      },
      include: {
        job: {
          include: {
            hirer: { include: { user: true } },
            category: true,
          },
        },
        freelancer: {
          include: { user: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: approvedJobs });
  } catch (error) {
    console.error('Error fetching approved jobs:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch approved jobs' }, { status: 500 });
  }
}
