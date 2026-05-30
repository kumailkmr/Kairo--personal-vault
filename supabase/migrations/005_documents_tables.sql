-- Kairo OS Migration — 005 Documents Tables
-- Setup Documents, versions, templates, and corporate legal contracts/agreements.

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Supabase Storage URI path
    file_hash TEXT,
    doc_type TEXT NOT NULL, -- proposal, contract, sow, nda, template
    status TEXT DEFAULT 'DRAFT' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_hash TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    content TEXT NOT NULL, -- Template HTML/Markdown/JSON body
    category TEXT NOT NULL, -- proposal, contract, sow, nda
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'DRAFT' NOT NULL, -- draft, sent, signed, void
    sent_at TIMESTAMP WITH TIME ZONE,
    signed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_id UUID REFERENCES agreements(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    budget_estimate DECIMAL(12, 2) NOT NULL,
    scope_details TEXT NOT NULL,
    status TEXT DEFAULT 'DRAFT' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_id UUID REFERENCES agreements(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    contract_terms TEXT NOT NULL,
    liquidated_damages TEXT,
    governing_law TEXT DEFAULT 'Delaware' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE ndas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_id UUID REFERENCES agreements(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    confidentiality_period TEXT DEFAULT '5 years' NOT NULL,
    permitted_use TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE sow_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_id UUID REFERENCES agreements(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    milestones_json JSONB NOT NULL,
    hourly_rate DECIMAL(8, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- TRIGGERS
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_agreements_updated_at BEFORE UPDATE ON agreements FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_sow_documents_updated_at BEFORE UPDATE ON sow_documents FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- PERFORMANCE INDEXES
CREATE INDEX idx_documents_client ON documents(client_id);
CREATE INDEX idx_documents_type ON documents(doc_type);
CREATE INDEX idx_document_versions_document ON document_versions(document_id);
CREATE INDEX idx_agreements_client ON agreements(client_id);
CREATE INDEX idx_proposals_agreement ON proposals(agreement_id);
CREATE INDEX idx_contracts_agreement ON contracts(agreement_id);
CREATE INDEX idx_ndas_agreement ON ndas(agreement_id);
CREATE INDEX idx_sow_documents_agreement ON sow_documents(agreement_id);

-- ROW LEVEL SECURITY
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ndas ENABLE ROW LEVEL SECURITY;
ALTER TABLE sow_documents ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Operators manage documents" ON documents FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view their own documents" ON documents FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

CREATE POLICY "Operators manage versions" ON document_versions FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view versions" ON document_versions FOR SELECT TO authenticated USING (
    document_id IN (SELECT id FROM documents WHERE client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email'))
);

CREATE POLICY "Operators manage templates" ON document_templates FOR ALL TO authenticated USING (is_operator(auth.uid()));

CREATE POLICY "Operators manage agreements" ON agreements FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view agreements" ON agreements FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

CREATE POLICY "Operators manage proposals" ON proposals FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view proposals" ON proposals FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

CREATE POLICY "Operators manage contracts" ON contracts FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view contracts" ON contracts FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

CREATE POLICY "Operators manage ndas" ON ndas FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view ndas" ON ndas FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

CREATE POLICY "Operators manage sow" ON sow_documents FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view sow" ON sow_documents FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);
