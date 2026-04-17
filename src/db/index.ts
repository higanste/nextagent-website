import { DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/d1';

export function getDb(d1Client: D1Database): DrizzleD1Database<typeof schema> {
  return drizzle(d1Client, { schema });
}
