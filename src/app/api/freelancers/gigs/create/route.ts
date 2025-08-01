import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

type PriceTierInput = {
  name: string
  description: string
  price: string
  token: string
  deliveryDays: string
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = session.user as { id: number }
    const userId = user.id

    const freelancer = await prisma.freelancerProfile.findUnique({
      where: { userId }
    })

    if (!freelancer) {
      return NextResponse.json({ error: 'Freelancer profile not found' }, { status: 404 })
    }

    const { title, description, acceptedTokens, priceTiers } = await req.json()

    const gig = await prisma.gig.create({
      data: {
        title,
        description,
        freelancerId: freelancer.id,
        acceptedTokens: acceptedTokens.join(','),
        priceTiers: {
          create: (priceTiers as PriceTierInput[]).map((tier) => ({
            name: tier.name,
            description: tier.description,
            price: parseFloat(tier.price),
            token: tier.token,
            deliveryDays: parseInt(tier.deliveryDays, 10)
          }))
        }
      },
      include: {
        priceTiers: true
      }
    })

    return NextResponse.json({ gig })
  } catch (error) {
    console.error('Error creating gig:', error)
    return NextResponse.json({ error: 'Failed to create gig' }, { status: 500 })
  }
}
