-- Kairo OS Migration — 007 Communications Tables
-- Setup message logs, twilio/resend integration trackers, and inbound public client onboarding requests.

CREATE TABLE communication_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    channel TEXT NOT NULL, -- whatsapp, email, slack
    direction TEXT NOT NULL, -- inbound, outbound
    subject TEXT,
    body TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    communication_log_id UUID NOT NULL REFERENCES communication_logs(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    message_sid TEXT UNIQUE,
    status TEXT NOT NULL, -- sent, delivered, read, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    communication_log_id UUID NOT NULL REFERENCES communication_logs(id) ON DELETE CASCADE,
    from_email TEXT NOT NULL,
    to_email TEXT NOT NULL,
    message_id TEXT UNIQUE,
    status TEXT NOT NULL, -- sent, delivered, bounce, opened
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE onboarding_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    project_type TEXT NOT NULL,
    budget_range TEXT NOT NULL,
    goals TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'DECLINED', 'pending', 'under_review', 'accepted', 'declined')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- TRIGGERS
CREATE TRIGGER update_onboarding_requests_updated_at BEFORE UPDATE ON onboarding_requests FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- INDEXES
CREATE INDEX idx_communication_logs_client ON communication_logs(client_id);
CREATE INDEX idx_communication_logs_user ON communication_logs(user_id);
CREATE INDEX idx_whatsapp_logs_comm ON whatsapp_logs(communication_log_id);
CREATE INDEX idx_email_logs_comm ON email_logs(communication_log_id);
CREATE INDEX idx_onboarding_requests_status ON onboarding_requests(status);

-- ROW LEVEL SECURITY
ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_requests ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Operators manage communication logs" ON communication_logs FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view their communication logs" ON communication_logs FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

CREATE POLICY "Operators manage whatsapp logs" ON whatsapp_logs FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view whatsapp logs" ON whatsapp_logs FOR SELECT TO authenticated USING (
    communication_log_id IN (SELECT id FROM communication_logs WHERE client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email'))
);

CREATE POLICY "Operators manage email logs" ON email_logs FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view email logs" ON email_logs FOR SELECT TO authenticated USING (
    communication_log_id IN (SELECT id FROM communication_logs WHERE client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email'))
);

CREATE POLICY "Public visitor onboarding submissions" ON onboarding_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Operators manage onboarding requests" ON onboarding_requests FOR ALL TO authenticated USING (is_operator(auth.uid()));
