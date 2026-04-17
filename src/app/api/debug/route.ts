import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { env } = getRequestContext() as any;
  
  return NextResponse.json({
    status: 'ok',
    runtime: 'edge',
    env_keys: Object.keys(env || {}),
    process_env_keys: Object.keys(process.env || {}),
    auth_secret_exists: !!process.env.AUTH_SECRET,
    google_id_exists: !!process.env.AUTH_GOOGLE_ID,
    db_binding_exists: !!env.nextagent_db,
  });
}
