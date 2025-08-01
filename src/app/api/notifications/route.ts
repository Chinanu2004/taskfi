// src/app/api/notifications/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  // Example: Assume wallet address is passed in headers
  const walletAddress = req.headers.get('x-wallet')

  if (!userId || !walletAddress) {
    return NextResponse.json({ success: false, message: 'Missing userId or walletAddress' }, { status: 400 })
  }

  try {
    // Find the user with that wallet
    const user = await prisma.user.findUnique({
      where: { walletAddress },
    })

    if (!user || user.id !== Number(userId)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    return NextResponse.json({ success: true, notifications })
  } catch (error) {
    console.error('Notification fetch error:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch notifications' }, { status: 500 })
  }
}
