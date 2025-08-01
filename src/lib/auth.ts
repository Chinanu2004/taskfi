// src/lib/auth.ts
import type { NextAuthOptions, Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

export const authOptions: NextAuthOptions = {
  providers: [], // Add your auth provider(s) here
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.walletAddress) {
        session.user.walletAddress = token.walletAddress as string;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user?.walletAddress) {
        token.walletAddress = user.walletAddress;
      }
      return token;
    },
  },
};
