import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { getRequestContext } from '@/cf-helpers';
import { getDb } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account }: any) {
      if (!user?.email || !account) return true;

      try {
        const { env } = getRequestContext() as unknown as { env: any };
        if (!env?.nextagent_db) {
          console.error('D1 Database binding missing in signIn callback');
          return true;
        }

        const db = getDb(env.nextagent_db);
        
        // Upsert user into D1
        const existing = await db.select().from(users).where(eq(users.email, user.email)).get();
        
        if (!existing) {
          await db.insert(users).values({
            id: user.id || crypto.randomUUID(),
            name: user.name,
            email: user.email,
            image: user.image,
            plan: 'free',
          });
        }
        
        return true;
      } catch (err) {
        console.error('Error during signIn callback:', err);
        return true; // Allow sign in even if DB update fails, to avoid blocking user
      }
    },
    session({ session, token }: any) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
});
