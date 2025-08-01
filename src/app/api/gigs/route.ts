// /app/api/gigs/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const gigs = await prisma.gig.findMany({
      where: { isActive: true },
      include: {
        priceTiers: {
          orderBy: { price: 'asc' }
        },
        freelancer: {
          include: {
            user: {
              select: {
                name: true,
                walletAddress: true,
                profileImage: true,
              }
            }
          }
        }
      }
    })

    return NextResponse.json({ gigs })
  } catch (error) {
    console.error('[GET /api/gigs]', error)
    return NextResponse.json({ error: 'Failed to fetch gigs' }, { status: 500 })
  }
}
