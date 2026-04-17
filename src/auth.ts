import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from './db';
import * as schema from './db/schema';

// This is required for Cloudflare Pages Edge Runtime compatibility with NextAuth
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
    }),
  ],
  // Use JWT sessions (no DB required for session reads)
  session: { strategy: 'jwt' },
  callbacks: {
    session({ session, token }: any) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn({ user }: any) {
      // On sign-in, upsert the user into D1 for usage tracking
      try {
        const { env } = getRequestContext() as unknown as { env: any };
        if (env?.nextagent_db && user?.id) {
          const db = getDb(env.nextagent_db);
          const { users } = schema;
          const { sql } = await import('drizzle-orm');
          await db.run(sql`
            INSERT INTO users (id, email, name, image, plan, created_at, updated_at)
            VALUES (${user.id}, ${user.email}, ${user.name}, ${user.image}, 'free', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT(id) DO UPDATE SET email = excluded.email, name = excluded.name, updated_at = CURRENT_TIMESTAMP
          `);
        }
      } catch (e) {
        // Non-blocking — allow sign-in even if DB upsert fails
        console.error('User upsert failed:', e);
      }
      return true;
    },
  },
} as any);
