// /types/next-auth.d.ts
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      walletAddress?: string
    }
  }

  interface User {
    walletAddress?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    walletAddress?: string
  }
}
