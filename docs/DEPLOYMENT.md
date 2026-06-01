# Kairo OS Deployment Guide

## Prerequisites
- Supabase Project (Database, Auth, Storage)
- GitHub Repository linked to Vercel

## Environment Variables
The following environment variables MUST be configured in your Vercel Project Settings prior to deployment:

```env
NEXT_PUBLIC_APP_URL="https://your-production-domain.com"
NEXT_PUBLIC_APP_ENV="production"
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

## Vercel Setup
1. Import your GitHub repository into Vercel.
2. Select **Next.js** as the framework.
3. Keep the default build command (`pnpm build`).
4. Enter the Environment Variables listed above.
5. Deploy.

## CI/CD Pipeline
Every pull request and push to the `main` branch triggers the GitHub Actions CI pipeline (`ci.yml`):
1. **Linting**: Enforces strict styling and code quality.
2. **Typechecking**: `pnpm tsc --noEmit` validates TypeScript types.
3. **Build**: `pnpm build` executes the production Next.js build.

## Production Checklist
- [ ] Database schema deployed via `supabase db push`.
- [ ] All 7 Storage buckets created manually in Supabase Dashboard (or via seeding script).
- [ ] Row-Level Security (RLS) policies are active on all tables.
- [ ] Real-time publications active on critical tables (`clients`, `projects`, `meetings`, etc.).
- [ ] Environment Variables verified in Vercel.

## Rollback Procedures
In the event of a critical failure:
1. Navigate to the **Deployments** tab in Vercel.
2. Select the last stable deployment and click **Promote to Production** (or "Instant Rollback").
3. Database rollbacks (if necessary) must be executed via Supabase PITR (Point-In-Time Recovery).
