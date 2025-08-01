// /app/api/verify-wallet/route.ts
import { NextResponse } from 'next/server'
import { PublicKey } from '@solana/web3.js'
import nacl from 'tweetnacl'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { message, signature, walletAddress } = body

    if (!message || !signature || !walletAddress) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const pubKey = new PublicKey(walletAddress)
    const msgBytes = new TextEncoder().encode(message)
    const sigBytes = Uint8Array.from(Buffer.from(signature, 'base64'))

    const isVerified = nacl.sign.detached.verify(
      msgBytes,
      sigBytes,
      pubKey.toBytes()
    )

    if (!isVerified) {
      return NextResponse.json({ success: false, verified: false }, { status: 401 })
    }

    // ✅ Save to DB
    await prisma.user.update({
      where: { walletAddress },
      data: { isWalletVerified: true },
    })

    return NextResponse.json({ success: true, verified: true }, { status: 200 })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
