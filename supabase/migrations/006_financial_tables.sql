-- Kairo OS Migration — 006 Financial Tables
-- Setup Financial core ledger: invoices, line items, transaction logs, and billing caches.

DROP TABLE IF EXISTS revenue_analytics_cache CASCADE;
DROP TABLE IF EXISTS payment_milestones CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    invoice_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'VOID', 'draft', 'sent', 'paid', 'overdue', 'void')) NOT NULL,
    amount DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    tax DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    issue_date TIMESTAMP WITH TIME ZONE NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    pdf_url TEXT, -- Link to invoices bucket PDF
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    unit_price DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    amount DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method TEXT NOT NULL, -- stripe, bank_transfer, crypto
    transaction_id TEXT,
    status TEXT NOT NULL, -- succeeded, pending, failed
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE payment_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES project_milestones(id) ON DELETE CASCADE,
    percentage DECIMAL(5, 2) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
    is_triggered BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE revenue_analytics_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    monthly_recurring_revenue DECIMAL(12, 2) NOT NULL,
    total_revenue DECIMAL(12, 2) NOT NULL,
    outstanding_invoices DECIMAL(12, 2) NOT NULL,
    forecast_revenue DECIMAL(12, 2) NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- TRIGGERS
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- INDEXES
CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_project ON invoices(project_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payment_milestones_project ON payment_milestones(project_id);

-- ROW LEVEL SECURITY
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_analytics_cache ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Operators manage invoices" ON invoices FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view their own invoices" ON invoices FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

CREATE POLICY "Operators manage invoice items" ON invoice_items FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view their invoice items" ON invoice_items FOR SELECT TO authenticated USING (
    invoice_id IN (SELECT id FROM invoices WHERE client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email'))
);

CREATE POLICY "Operators manage payments" ON payments FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view their payments" ON payments FOR SELECT TO authenticated USING (
    invoice_id IN (SELECT id FROM invoices WHERE client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email'))
);

CREATE POLICY "Operators manage billing milestones" ON payment_milestones FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view billing milestones" ON payment_milestones FOR SELECT TO authenticated USING (
    project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email'))
);

CREATE POLICY "Operators manage cache" ON revenue_analytics_cache FOR ALL TO authenticated USING (is_operator(auth.uid()));
