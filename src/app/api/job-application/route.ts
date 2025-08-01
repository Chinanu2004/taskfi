import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { type NextRequest } from 'next/server'

// POST to apply, update status, or mark job as completed
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { freelancerId, jobId, status, completionStatus } = body

    if (!freelancerId || !jobId) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 })
    }

    // If status or completionStatus is passed, update existing application
    if (status || completionStatus) {
      const updateData: Record<string, string> = {}

      if (status) {
        if (!['accepted', 'rejected'].includes(status)) {
          return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 })
        }
        updateData.status = status
      }

      if (completionStatus) {
        if (!['submitted', 'approved', 'disputed'].includes(completionStatus)) {
          return NextResponse.json({ success: false, message: 'Invalid completion status' }, { status: 400 })
        }
        updateData.completionStatus = completionStatus
      }

      const updated = await prisma.jobApplication.updateMany({
        where: {
          freelancerId,
          jobId,
        },
        data: updateData,
      })

      return NextResponse.json({ success: true, updated })
    }

    // Otherwise, create new application
    const application = await prisma.jobApplication.create({
      data: {
        job: { connect: { id: jobId } },
        freelancer: { connect: { id: freelancerId } },
        status: 'pending',
        completionStatus: 'pending',
      },
    })

    return NextResponse.json({ success: true, data: application })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: 'Error handling job application' }, { status: 500 })
  }
}
