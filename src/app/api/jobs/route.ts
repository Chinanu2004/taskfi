import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.json()
  const { title, description, price, token, hirerId, categoryId } = body

  try {
    const job = await prisma.job.create({
      data: {
        title,
        description,
        price,
        token,
        category: { connect: { id: categoryId } },
        hirer: { connect: { id: hirerId } },
      },
    })

    // Create chat for this job
    await prisma.chat.create({
      data: {
        job: { connect: { id: job.id } },
      },
    })

    return NextResponse.json({ success: true, job })
  } catch (error) {
    console.error('[JOB_CREATE_ERROR]', error)
    return NextResponse.json({ success: false, error: 'Job creation failed' }, { status: 500 })
  }
}
