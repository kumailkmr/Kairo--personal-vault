# Kairo OS Backup & Recovery

## Automated Backups (Supabase)
Kairo OS relies heavily on Supabase's managed infrastructure.
- **Pro Plan (Recommended)**: Daily automated logical backups with 7-day retention.
- **Point-in-Time Recovery (PITR)**: Available as an add-on, strongly recommended for enterprise production to recover exactly to the minute before a catastrophic failure.

## Storage Backups
Supabase Storage buckets (`kairo-docs`, `kairo-media`, etc.) are backed up automatically alongside the core database. No additional configuration is required, but it is recommended to periodically sync critical client documents to a secondary off-site vault (e.g., AWS S3).

## Manual Backups
For regulatory compliance, perform manual backups using standard PostgreSQL tooling:

```bash
pg_dump "postgres://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres" > kairo-backup.sql
```

## Disaster Recovery Runbook
1. **Identify the Failure**: Determine if the issue is a data corruption, an accidental deletion, or a platform outage.
2. **Halt Operations**: Engage "Maintenance Mode" in Vercel to prevent further writes.
3. **Restore Data**:
   - If using PITR: Use the Supabase dashboard to restore to the exact minute before the event.
   - If using Daily Backups: Restore the latest daily backup snapshot from the Supabase dashboard.
   - If restoring manually: Use `psql` to restore from the `kairo-backup.sql` file.
4. **Verify Integrity**: Check the operational dashboard and ensure relations are intact.
5. **Resume Operations**: Disable Maintenance Mode in Vercel.
