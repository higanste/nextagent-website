import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from './db';
import * as schema from './db/schema';

// This is required for Cloudflare Pages Edge Runtime compatibility with NextAuth
export const { handlers, signIn, signOut, auth } = NextAuth(() => {
  // We use a function here so getRequestContext is only called at runtime
  // allowing CF env bindings to be available
  let adapter;
  try {
    const { env } = getRequestContext() as unknown as { env: any };
    if (env?.nextagent_db) {
      adapter = DrizzleAdapter(getDb(env.nextagent_db), {
        usersTable: schema.users,
        accountsTable: schema.accounts,
      });
    }
  } catch (e) {
    // Graceful fail outside of CF context
  }

  return {
    providers: [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID || 'dummy',
        clientSecret: process.env.AUTH_GOOGLE_SECRET || 'dummy',
      }),
    ],
    adapter,
    session: { strategy: 'jwt' },
    callbacks: {
      session({ session, token }: any) {
        if (session.user && token.sub) {
          session.user.id = token.sub;
        }
        return session;
      },
    },
    // We don't want Supabase anymore, all D1/Auth.js native now!
  } as any;
});
