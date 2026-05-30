-- Kairo OS Migration — 004 Meetings Tables
-- Setup Meetings coordination, reminders, notes, closing pipelines, and follow-up schedules.

DROP TABLE IF EXISTS meeting_analytics_cache CASCADE;
DROP TABLE IF EXISTS scheduling_events CASCADE;
DROP TABLE IF EXISTS follow_up_tasks CASCADE;
DROP TABLE IF EXISTS closing_pipeline CASCADE;
DROP TABLE IF EXISTS meeting_activity_logs CASCADE;
DROP TABLE IF EXISTS meeting_reminders CASCADE;
DROP TABLE IF EXISTS meeting_notes CASCADE;
DROP TABLE IF EXISTS meetings CASCADE;

CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    platform TEXT DEFAULT 'google_meet' NOT NULL,
    platform_link TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT check_meeting_times CHECK (end_time > start_time)
);

CREATE TABLE meeting_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    action_items JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE meeting_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    remind_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_sent BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE meeting_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE closing_pipeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    stage TEXT NOT NULL CHECK (stage IN ('New Inquiry', 'Discovery Scheduled', 'Requirement Analysis', 'Proposal Sent', 'Negotiation', 'Payment Pending', 'Closed Won', 'Closed Lost')) DEFAULT 'New Inquiry',
    projected_revenue DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE follow_up_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE scheduling_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    platform TEXT NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE meeting_analytics_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_key TEXT UNIQUE NOT NULL,
    metric_value JSONB NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- TRIGGERS
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_meeting_notes_updated_at BEFORE UPDATE ON meeting_notes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_closing_pipeline_updated_at BEFORE UPDATE ON closing_pipeline FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_follow_up_tasks_updated_at BEFORE UPDATE ON follow_up_tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- PERFORMANCE OPTIMIZATION INDEXES
CREATE INDEX idx_meetings_client ON meetings(client_id);
CREATE INDEX idx_meetings_start ON meetings(start_time);
CREATE INDEX idx_meeting_notes_meeting ON meeting_notes(meeting_id);
CREATE INDEX idx_meeting_reminders_time ON meeting_reminders(remind_at) WHERE is_sent = FALSE;
CREATE INDEX idx_closing_pipeline_client ON closing_pipeline(client_id);
CREATE INDEX idx_closing_pipeline_stage ON closing_pipeline(stage);
CREATE INDEX idx_follow_up_tasks_client ON follow_up_tasks(client_id);
CREATE INDEX idx_follow_up_tasks_due ON follow_up_tasks(due_date);

-- ROW LEVEL SECURITY
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE closing_pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduling_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_analytics_cache ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Operators manage meetings" ON meetings FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view their own meetings" ON meetings FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

CREATE POLICY "Operators manage meeting notes" ON meeting_notes FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view their meeting notes" ON meeting_notes FOR SELECT TO authenticated USING (
    meeting_id IN (SELECT id FROM meetings WHERE client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email'))
);

CREATE POLICY "Operators manage meeting reminders" ON meeting_reminders FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Operators manage meeting activity logs" ON meeting_activity_logs FOR ALL TO authenticated USING (is_operator(auth.uid()));

CREATE POLICY "Operators manage closing pipeline" ON closing_pipeline FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view their closing pipeline" ON closing_pipeline FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

CREATE POLICY "Operators manage follow-up tasks" ON follow_up_tasks FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view their follow-up tasks" ON follow_up_tasks FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

CREATE POLICY "Operators manage scheduling events" ON scheduling_events FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view their scheduling events" ON scheduling_events FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

CREATE POLICY "Operators manage analytics cache" ON meeting_analytics_cache FOR ALL TO authenticated USING (is_operator(auth.uid()));
