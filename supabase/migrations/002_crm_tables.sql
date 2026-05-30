-- Kairo OS Migration — 002 CRM Tables
-- Setup CRM tables for account records, contacts, notes, tags, and audit logs.

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    retainer_status TEXT DEFAULT 'ACTIVE' CHECK (retainer_status IN ('ACTIVE', 'REVIEW', 'PAUSED', 'TERMINATED', 'active', 'review', 'paused', 'terminated')) NOT NULL,
    monthly_retainer DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE client_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE client_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE client_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(client_id, tag)
);

CREATE TABLE client_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- TRIGGERS
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_client_contacts_updated_at BEFORE UPDATE ON client_contacts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_client_notes_updated_at BEFORE UPDATE ON client_notes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- PERFORMANCE INDEXES
CREATE INDEX idx_clients_owner ON clients(owner_id);
CREATE INDEX idx_clients_status ON clients(retainer_status);
CREATE INDEX idx_client_contacts_client ON client_contacts(client_id);
CREATE INDEX idx_client_notes_client ON client_notes(client_id);

-- ROW LEVEL SECURITY
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Operators manage clients" ON clients FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients select their own client record" ON clients FOR SELECT TO authenticated USING (email = auth.jwt()->>'email');

CREATE POLICY "Operators manage client contacts" ON client_contacts FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients select their own contacts" ON client_contacts FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

CREATE POLICY "Operators manage client notes" ON client_notes FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients select their own notes" ON client_notes FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

CREATE POLICY "Operators manage client tags" ON client_tags FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients select their own tags" ON client_tags FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

CREATE POLICY "Operators manage activity logs" ON client_activity_logs FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view their own activity logs" ON client_activity_logs FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);
