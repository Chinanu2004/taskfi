// app/api/job-application/[applicationId]/accept/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { applicationId: string } }) {
  const applicationId = parseInt(params.applicationId);

  if (isNaN(applicationId)) {
    return NextResponse.json({ success: false, message: 'Invalid application ID' }, { status: 400 });
  }

  try {
    // Get application info
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
        freelancer: {
          include: { user: true }
        }
      },
    });

    if (!application) {
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
    }

    // Step 1: Update application status
    await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status: 'accepted' },
    });

    // Step 2: Assign freelancer to the job
    const updatedJob = await prisma.job.update({
      where: { id: application.jobId },
      data: { freelancerId: application.freelancerId },
    });

    // Step 3: Create notification
    await prisma.notification.create({
      data: {
        userId: application.freelancer.user.id,
        type: 'job_accepted',
        message: `Your application was accepted for job: ${application.job.title}`,
      },
    });

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error) {
    console.error('[ACCEPT_APPLICATION_ERROR]', error);
    return NextResponse.json({ success: false, message: 'Job acceptance failed' }, { status: 500 });
  }
}
