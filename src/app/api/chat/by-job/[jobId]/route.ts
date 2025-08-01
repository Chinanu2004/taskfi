import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { jobId: string } }) {
  try {
    const chat = await prisma.chat.findFirst({
  where: {
    job: {
      id: Number(params.jobId),
    },
  },
})

    if (!chat) {
      return NextResponse.json({ success: false, message: 'Chat not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, chatId: chat.id })
  } catch (error) {
    console.error('[CHAT_BY_JOB_GET_ERROR]', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
