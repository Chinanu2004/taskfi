import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const walletAddress = searchParams.get('wallet')

  if (!walletAddress) {
    return NextResponse.json({ success: false, error: 'Missing wallet address' }, { status: 400 })
  }

  try {
    const jobs = await prisma.job.findMany({
      where: {
        hirer: {
          user: {
            walletAddress,
          },
        },
      },
      include: {
        freelancer: {
          include: {
            user: true,
          },
        },
        category: true,
      },
    })

    const formatted = jobs.map((job) => ({
      id: job.id,
      freelancerName: job.freelancer?.user?.name || 'Unknown',
      category: job.category?.name || 'Unknown',
      status: job.status,
      isReleased: job.isReleased,
      dateHired: new Date(job.createdAt).toLocaleDateString(),
    }))

    return NextResponse.json({ success: true, jobs: formatted })
  } catch (err) {
    console.error('Error fetching hirer jobs:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch jobs' }, { status: 500 })
  }
}
