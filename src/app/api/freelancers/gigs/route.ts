import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const gigs = await prisma.gig.findMany({
      where: { isActive: true },
      include: {
        freelancer: {
          include: {
            user: {
              select: {
                name: true,
                walletAddress: true,
                profileImage: true
              }
            }
          }
        },
        priceTiers: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ gigs })
  } catch (error) {
    console.error('Error fetching gigs:', error)
    return NextResponse.json({ error: 'Failed to fetch gigs' }, { status: 500 })
  }
}
