import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = parseInt(params.id)

    const freelancers = await prisma.freelancerProfile.findMany({
      where: {
        freelancerCategories: {
          some: {
            categoryId: categoryId,
          },
        },
      },
      include: {
        user: true,
        freelancerCategories: true, // 👈 important!
      },
    })

    return NextResponse.json({ success: true, data: freelancers })
  } catch (error) {
    console.error('Error fetching freelancers:', error)
    return NextResponse.json(
      { success: false, message: 'Server Error' },
      { status: 500 }
    )
  }
}
