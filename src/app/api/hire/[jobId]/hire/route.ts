// app/api/hire/[jobId]/hire/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { jobId: string } }) {
  const { freelancerId } = await req.json();
  const jobId = parseInt(params.jobId);

  if (!freelancerId || isNaN(jobId)) {
    return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
  }

  try {
    // Update the job with selected freelancer
    const job = await prisma.job.update({
      where: { id: jobId },
      data: {
        freelancerId: parseInt(freelancerId),
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: parseInt(freelancerId),
        type: 'job_hired',
        message: `You have been hired for the job: ${job.title}`,
      },
    });

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error('[HIRE_FREELANCER_ERROR]', error);
    return NextResponse.json({ success: false, message: 'Hiring failed' }, { status: 500 });
  }
}
