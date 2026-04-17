# NextAgent Deployment Notes

## Architecture
- Framework: Next.js 15
- Adapter: @opennextjs/cloudflare (OpenNext)
- Runtime: Cloudflare Workers
- Database: Cloudflare D1 (nextagent-db)
- Storage: Cloudflare R2 (nextagent-docs)
- Auth: NextAuth v5 (Auth.js)

## Build Process
The CI/CD pipeline uses Cloudflare Pages Connected to GitHub.
Build command: `npm install --legacy-peer-deps && npx opennextjs-cloudflare build && npx wrangler deploy`
The deployment uses `wrangler deploy` which requires `CLOUDFLARE_API_TOKEN` in the Pages environment variables.

## Bindings
- `nextagent_db` → D1 database
- `nextagent_docs` → R2 storage bucket
