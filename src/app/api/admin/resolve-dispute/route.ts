import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { jobApplicationId, newStatus } = await req.json()

  if (!jobApplicationId || !newStatus) {
    return NextResponse.json({ error: 'Missing jobApplicationId or newStatus' }, { status: 400 })
  }

  const updatedApplication = await prisma.jobApplication.update({
    where: { id: jobApplicationId },
    data: {
      completionStatus: newStatus,
    },
  })

  return NextResponse.json(updatedApplication)
}
