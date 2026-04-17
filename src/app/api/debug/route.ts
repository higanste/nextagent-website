import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@/cf-helpers';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const ctx = getRequestContext();
    const env = ctx?.env || {};
    
    return NextResponse.json({
      status: 'ok',
      runtime: 'edge',
      has_ctx: !!ctx,
      env_keys: Object.keys(env),
      process_env_keys: Object.keys(process.env || {}),
      auth_secret_exists: !!process.env.AUTH_SECRET,
      google_id_exists: !!process.env.AUTH_GOOGLE_ID,
      db_binding_exists: !!(env as any).nextagent_db,
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'error',
      msg: err.message,
      stack: err.stack
    }, { status: 500 });
  }
}
