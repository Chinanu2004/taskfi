import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const chats = await prisma.chat.findMany({
      include: {
        job: {
          include: {
            hirer: { include: { user: true } },
            freelancer: { include: { user: true } },
          },
        },
      },
    })

    return NextResponse.json({ success: true, chats })
  } catch (error) {
    console.error('[ADMIN_GET_CHATS]', error)
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 })
  }
}
