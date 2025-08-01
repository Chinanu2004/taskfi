// /app/api/admin/release-funds/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { jobApplicationId } = await req.json()

    const application = await prisma.jobApplication.findUnique({
      where: { id: jobApplicationId },
      include: {
        freelancer: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!application?.freelancer?.user?.walletAddress) {
      return NextResponse.json({ error: 'Freelancer wallet not found' }, { status: 400 })
    }

    const walletAddress = application.freelancer.user.walletAddress

    // Optional: You can mark the job as "ready_to_release" or similar status here
    await prisma.jobApplication.update({
      where: { id: jobApplicationId },
      data: {
        completionStatus: 'release_pending',
      },
    })

    return NextResponse.json({ walletAddress })
  } catch (error) {
    console.error('Release Funds Error:', error)
    return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 })
  }
}
