-- Kairo OS Migration — 013 Security & RBAC Core
-- Setup private storage buckets, secure CDN path RLS policies, and enterprise audit tracking logs.

-- 1. STORAGE BUCKETS PROVISIONING
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('invoices', 'invoices', false, NULL, NULL),
  ('agreements', 'agreements', false, NULL, NULL),
  ('proposals', 'proposals', false, NULL, NULL),
  ('onboarding', 'onboarding', false, NULL, NULL),
  ('branding', 'branding', false, NULL, NULL),
  ('uploads', 'uploads', false, NULL, NULL),
  ('contracts', 'contracts', false, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- 2. STORAGE POLICIES

-- Remove duplicate policies if any exist
DROP POLICY IF EXISTS "Allow operators all storage access" ON storage.objects;
DROP POLICY IF EXISTS "Allow clients select their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Allow clients insert their own folder" ON storage.objects;

-- Policy A: Operators (owner, admin, operator, assistant) have absolute read/write/delete access to all files
CREATE POLICY "Allow operators all storage access" ON storage.objects
FOR ALL TO authenticated
USING (
  is_operator(auth.uid()) OR has_role_level(auth.uid(), 45)
);

-- Policy B: Clients can SELECT files inside their scoped folder 'vault/client_id/...'
CREATE POLICY "Allow clients select their own folder" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id IN ('invoices', 'agreements', 'proposals', 'onboarding', 'branding', 'uploads', 'contracts')
  AND (storage.foldername(name))[1] = 'vault'
  AND EXISTS (
    SELECT 1 FROM clients c
    WHERE c.id::text = (storage.foldername(name))[2]
      AND c.email = auth.jwt()->>'email'
  )
);

-- Policy C: Clients can INSERT files inside their scoped folder 'vault/client_id/...'
CREATE POLICY "Allow clients insert their own folder" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id IN ('invoices', 'agreements', 'proposals', 'onboarding', 'branding', 'uploads', 'contracts')
  AND (storage.foldername(name))[1] = 'vault'
  AND EXISTS (
    SELECT 1 FROM clients c
    WHERE c.id::text = (storage.foldername(name))[2]
      AND c.email = auth.jwt()->>'email'
  )
);

-- 3. ENTERPRISE AUDIT INTEGRITY TRACKING
DROP TABLE IF EXISTS audit_logs CASCADE;
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id TEXT,
    details JSONB,
    severity TEXT DEFAULT 'INFO' CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Operators manage audit logs" ON audit_logs FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients read their own audits" ON audit_logs FOR SELECT TO authenticated USING (
    user_id = auth.uid()
);
