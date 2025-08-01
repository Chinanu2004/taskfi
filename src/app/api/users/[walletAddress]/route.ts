// src/app/api/users/[walletAddress]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, context: { params: { walletAddress: string } }) {
  const walletAddress = context.params.walletAddress

  try {
    const user = await prisma.user.findUnique({
      where: { walletAddress },
      select: { isWalletVerified: true },
    })

    if (!user) {
      return NextResponse.json({ success: false, isWalletVerified: false }, { status: 404 })
    }

    return NextResponse.json({ success: true, isWalletVerified: user.isWalletVerified })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, isWalletVerified: false }, { status: 500 })
  }
}
