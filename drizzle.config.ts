import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: '0bf56584-b59a-4874-ac21-7c4ded047612',
    token: process.env.CLOUDFLARE_API_TOKEN!,
  },
});
