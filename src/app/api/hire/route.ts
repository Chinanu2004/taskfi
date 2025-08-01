// POST /api/hire
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, categoryId, price, token, walletAddress, freelancerId } = body

    if (!walletAddress || !price || !token || !categoryId) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: { hirer: true },
    })

    if (!user?.hirer) {
      return NextResponse.json({ success: false, message: 'Hirer profile not found' }, { status: 400 })
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        token,
        categoryId: parseInt(categoryId),
        hirerId: user.hirer.id,
        freelancerId: freelancerId || null, // Optional: Can auto-assign now or later
      },
    })

    return NextResponse.json({ success: true, job })
  } catch (error) {
    console.error('Hire API Error:', error)
    return NextResponse.json({ success: false, message: 'Internal error' }, { status: 500 })
  }
}
