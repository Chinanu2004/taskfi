// src/app/api/notifications/[id]/read/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const notifId = parseInt(params.id)

    if (isNaN(notifId)) {
      return NextResponse.json({ success: false, message: 'Invalid notification ID' }, { status: 400 })
    }

    await prisma.notification.update({
      where: { id: notifId },
      data: { isRead: true },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notification mark-read error:', error)
    return NextResponse.json({ success: false, message: 'Could not mark notification as read' }, { status: 500 })
  }
}
