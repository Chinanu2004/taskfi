import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { walletAddress } = await req.json()

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address missing' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { walletAddress },
    include: { freelancer: true },
  })

  if (!user || !user.freelancer) {
    return NextResponse.json({ error: 'Freelancer not found' }, { status: 404 })
  }

  const freelancerId = user.freelancer.id

  const earnings = await prisma.job.findMany({
    where: {
      freelancerId,
      applications: {
        some: {
          completionStatus: 'completed',
        },
      },
    },
    select: { price: true }, // ✅ This works now because price is on Job model
  })

  const total = earnings.reduce((sum, job) => sum + job.price, 0)

  return NextResponse.json({ earnings: total })
}
