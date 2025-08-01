// /app/api/freelancers/applications/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { freelancerId } = body

    if (!freelancerId) {
      return NextResponse.json({ success: false, message: 'Missing freelancerId' }, { status: 400 })
    }

    const applications = await prisma.jobApplication.findMany({
      where: { freelancerId },
      include: {
        job: {
          include: {
            hirer: {
              include: {
                user: true,
              },
            },
            category: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: applications })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: 'Error fetching freelancer applications' }, { status: 500 })
  }
}
