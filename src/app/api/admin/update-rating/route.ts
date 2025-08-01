// /app/api/admin/update-rating/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { freelancerId, newRating } = await req.json()

  if (!freelancerId || typeof newRating !== 'number') {
    return NextResponse.json({ error: 'Missing or invalid data' }, { status: 400 })
  }

  const updatedFreelancer = await prisma.freelancerProfile.update({
    where: { id: freelancerId },
    data: { rating: newRating },
  })

  return NextResponse.json({ success: true, freelancer: updatedFreelancer })
}
