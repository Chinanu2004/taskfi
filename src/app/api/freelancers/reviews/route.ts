// /app/api/freelancers/review/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { walletAddress } = await req.json()

  const user = await prisma.user.findUnique({
    where: { walletAddress },
    include: {
      freelancer: true
    }
  })

  if (!user?.freelancer) {
    return NextResponse.json({ error: 'Freelancer not found' }, { status: 404 })
  }

  const reviews = await prisma.review.findMany({
    where: { freelancerId: user.freelancer.id },
    include: {
      job: { select: { title: true } },
      hirer: { select: { name: true, profileImage: true } }
    },
    orderBy: { id: 'desc' }
  })

  return NextResponse.json(reviews)
}
