import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const jobId = parseInt(params.id)

  try {
    const job = await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'cancelled',
      },
    })

    return NextResponse.json({ success: true, job })
  } catch (err) {
    console.error('Cancel error:', err)
    return NextResponse.json({ success: false, error: 'Failed to cancel job' }, { status: 500 })
  }
}
