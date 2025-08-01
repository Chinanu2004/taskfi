import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const wallet = req.headers.get('x-wallet')
  if (!wallet) return NextResponse.json({ success: false, message: 'Missing wallet' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { walletAddress: wallet } })
  if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })

  await prisma.notification.updateMany({
    where: {
      userId: user.id,
      isRead: false,
    },
    data: { isRead: true },
  })

  return NextResponse.json({ success: true })
}
