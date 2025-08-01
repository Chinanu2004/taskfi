// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import type { NextAuthOptions, Session, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import nacl from 'tweetnacl'
import bs58 from 'bs58'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Solana Wallet',
      credentials: {
        walletAddress: { label: 'Wallet Address', type: 'text' },
        signature:     { label: 'Signature',      type: 'text' },
        message:       { label: 'Message',        type: 'text' },
      },
      async authorize(credentials): Promise<User | null> {
        const walletAddress = credentials?.walletAddress ?? ''
        const signature     = credentials?.signature     ?? ''
        const message       = credentials?.message       ?? ''

        const isValid = nacl.sign.detached.verify(
          new TextEncoder().encode(message),
          bs58.decode(signature),
          bs58.decode(walletAddress)
        )
        if (!isValid) return null

        // NextAuth will store this in the JWT
        return { id: walletAddress, walletAddress } as User
      },
    }),
  ],

  callbacks: {
    // Persist walletAddress into the JWT on first sign in
    async jwt({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
      if (user?.walletAddress) {
        token.walletAddress = user.walletAddress
      }
      return token
    },

    // Make walletAddress available in session
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      session.user = session.user ?? {}
      if (token.walletAddress && typeof token.walletAddress === 'string') {
        session.user.walletAddress = token.walletAddress
      }
      return session
    },
  },

  // Use JWT strategy
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET as string,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
