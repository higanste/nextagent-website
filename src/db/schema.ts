import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique().notNull(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
  plan: text('plan').default('free'),
  stripeCustomerId: text('stripeCustomerId'),
  stripeSubscriptionId: text('stripeSubscriptionId'),
});

export const accounts = sqliteTable('accounts', {
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').$type<'oauth' | 'oidc' | 'email'>().notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state')
});

export const documents = sqliteTable('documents', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  sizeBytes: integer('sizeBytes'),
  chunkCount: integer('chunkCount').default(0),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
});

export const chunks = sqliteTable('document_chunks', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  documentId: text('documentId').notNull().references(() => documents.id, { onDelete: 'cascade' }),
  userId: text('userId').notNull(),
  chunkIndex: integer('chunkIndex').notNull(),
  content: text('content').notNull(),
});

export const usageLogs = sqliteTable('usage_logs', {
  userId: text('userId').notNull(),
  action: text('action').notNull(), // 'upload' or 'ask'
  date: text('date').notNull(), // YYYY-MM-DD
  count: integer('count').default(1),
});
