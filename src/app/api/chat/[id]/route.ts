import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const chatId = parseInt(params.id)

  try {
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { sentAt: 'asc' },
    })

    return NextResponse.json({ success: true, messages })
  } catch (error) {
    console.error('[ADMIN_GET_CHAT_MESSAGES]', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
