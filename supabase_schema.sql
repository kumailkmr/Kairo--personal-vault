-- Kairo OS — Master Database Schema & Operational Data DDL
-- Highly normalized, production-grade schema for enterprise-scale relational integrity,
-- strict Row Level Security (RLS), automated audit triggers, and performance-tuned indexing.
-- Supabase Native Integration: References auth.users directly. Idempotent cascade drop reset.

-- ==========================================
-- 0. CLEAN SLATE SCHEMA RESET (CASCADE)
-- ==========================================

DROP TABLE IF EXISTS client_activity_logs CASCADE;
DROP TABLE IF EXISTS client_tags CASCADE;
DROP TABLE IF EXISTS client_notes CASCADE;
DROP TABLE IF EXISTS client_contacts CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS project_status_logs CASCADE;
DROP TABLE IF EXISTS project_assets CASCADE;
DROP TABLE IF EXISTS project_tasks CASCADE;
DROP TABLE IF EXISTS project_milestones CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS sow_documents CASCADE;
DROP TABLE IF EXISTS ndas CASCADE;
DROP TABLE IF EXISTS contracts CASCADE;
DROP TABLE IF EXISTS proposals CASCADE;
DROP TABLE IF EXISTS agreements CASCADE;
DROP TABLE IF EXISTS document_versions CASCADE;
DROP TABLE IF EXISTS document_templates CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS meeting_activity_logs CASCADE;
DROP TABLE IF EXISTS meeting_reminders CASCADE;
DROP TABLE IF EXISTS meeting_notes CASCADE;
DROP TABLE IF EXISTS meetings CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS payment_milestones CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS revenue_analytics_cache CASCADE;
DROP TABLE IF EXISTS ai_task_logs CASCADE;
DROP TABLE IF EXISTS ai_tasks CASCADE;
DROP TABLE IF EXISTS ai_agents CASCADE;
DROP TABLE IF EXISTS automation_events CASCADE;
DROP TABLE IF EXISTS workflow_runs CASCADE;
DROP TABLE IF EXISTS ai_workflows CASCADE;
DROP TABLE IF EXISTS notification_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS notification_preferences CASCADE;
DROP TABLE IF EXISTS goal_progress_logs CASCADE;
DROP TABLE IF EXISTS execution_tasks CASCADE;
DROP TABLE IF EXISTS roadmap_items CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS productivity_logs CASCADE;
DROP TABLE IF EXISTS life_os_entries CASCADE;
DROP TABLE IF EXISTS whatsapp_logs CASCADE;
DROP TABLE IF EXISTS email_logs CASCADE;
DROP TABLE IF EXISTS communication_logs CASCADE;
DROP TABLE IF EXISTS onboarding_requests CASCADE;
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS dashboard_metrics_cache CASCADE;
DROP TABLE IF EXISTS operational_insights CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS sessions_log CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- ==========================================
-- 1. GLOBAL PLUMBING & CORE FUNCTIONS
-- ==========================================

-- Trigger to automate updated_at timestamp updating
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automate user role checks in RLS
CREATE OR REPLACE FUNCTION is_operator(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = user_id AND (role = 'OPERATOR' OR role = 'operator')
    );
END;
$$ language 'plpgsql';

-- ==========================================
-- 2. USERS & PREFERENCES INFRASTRUCTURE
-- ==========================================

-- A. user_profiles (detailed demographics and RBAC - links to auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'CLIENT' CHECK (role IN ('OPERATOR', 'CLIENT', 'operator', 'client')) NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- B. user_preferences
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    theme TEXT DEFAULT 'dark' NOT NULL,
    timezone TEXT DEFAULT 'UTC' NOT NULL,
    biometrics_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    mfa_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- C. sessions_log
CREATE TABLE sessions_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    location TEXT,
    login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    logout_at TIMESTAMP WITH TIME ZONE
);

-- ==========================================
-- 3. CRM INFRASTRUCTURE
-- ==========================================

-- A. clients
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

-- B. client_contacts
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

-- C. client_notes
CREATE TABLE client_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- D. client_tags
CREATE TABLE client_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(client_id, tag)
);

-- E. client_activity_logs
CREATE TABLE client_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ==========================================
-- 4. PROJECTS INFRASTRUCTURE
-- ==========================================

-- A. projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'IN_PROGRESS' CHECK (status IN ('PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'ARCHIVED', 'planning', 'in_progress', 'review', 'completed', 'archived')) NOT NULL,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100) NOT NULL,
    budget DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- B. project_milestones
CREATE TABLE project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_date TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- C. project_tasks
CREATE TABLE project_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES project_milestones(id) ON DELETE SET NULL,
    assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'TODO' NOT NULL,
    priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'low', 'medium', 'high', 'critical')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- D. project_assets
CREATE TABLE project_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Supabase Storage URI
    file_size INTEGER NOT NULL,
    mime_type TEXT,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- E. project_status_logs
CREATE TABLE project_status_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ==========================================
-- 5. MEETINGS INFRASTRUCTURE
-- ==========================================

-- A. meetings
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

-- B. meeting_notes
CREATE TABLE meeting_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    action_items JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- C. meeting_reminders
CREATE TABLE meeting_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    remind_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_sent BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- D. meeting_activity_logs
CREATE TABLE meeting_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ==========================================
-- 6. FINANCIAL INFRASTRUCTURE
-- ==========================================

-- A. invoices
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

-- B. invoice_items
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    unit_price DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    amount DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- C. payments
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

-- D. payment_milestones
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

-- E. revenue_analytics_cache
CREATE TABLE revenue_analytics_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    monthly_recurring_revenue DECIMAL(12, 2) NOT NULL,
    total_revenue DECIMAL(12, 2) NOT NULL,
    outstanding_invoices DECIMAL(12, 2) NOT NULL,
    forecast_revenue DECIMAL(12, 2) NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ==========================================
-- 7. DOCUMENTS INFRASTRUCTURE
-- ==========================================

-- A. documents
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

-- B. document_versions
CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_hash TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- C. document_templates
CREATE TABLE document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    content TEXT NOT NULL, -- Template HTML/Markdown/JSON body
    category TEXT NOT NULL, -- proposal, contract, sow, nda
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- D. agreements (Core parent for legal elements)
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

-- E. proposals
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

-- F. contracts
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

-- G. ndas (Non-Disclosure Agreements)
CREATE TABLE ndas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_id UUID REFERENCES agreements(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    confidentiality_period TEXT DEFAULT '5 years' NOT NULL,
    permitted_use TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- H. sow_documents (Statements of Work)
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

-- ==========================================
-- 8. AI OPERATIONS INFRASTRUCTURE
-- ==========================================

-- A. ai_agents
CREATE TABLE ai_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    agent_type TEXT NOT NULL, -- Sentiment, Summarizer, FinancialForecast, CodeReviewer
    description TEXT,
    status TEXT DEFAULT 'IDLE' CHECK (status IN ('IDLE', 'RUNNING', 'SUCCESS', 'FAILED', 'idle', 'running', 'success', 'failed')) NOT NULL,
    success_rate DECIMAL(5, 2) DEFAULT 100.00 NOT NULL,
    last_run TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- B. ai_tasks
CREATE TABLE ai_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES ai_agents(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING' NOT NULL, -- pending, running, completed, failed
    payload JSONB, -- Context data
    result JSONB,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- C. ai_task_logs
CREATE TABLE ai_task_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES ai_tasks(id) ON DELETE CASCADE,
    log_level TEXT DEFAULT 'INFO' NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- D. ai_workflows
CREATE TABLE ai_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    trigger_type TEXT NOT NULL, -- cron, inbound_hook, client_onboard, payment_overdue
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- E. workflow_runs
CREATE TABLE workflow_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES ai_workflows(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'PENDING' NOT NULL, -- pending, executing, completed, failed
    execution_time_ms INTEGER DEFAULT 0 NOT NULL,
    metadata JSONB,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- F. automation_events
CREATE TABLE automation_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_run_id UUID REFERENCES workflow_runs(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- step_completed, webhook_dispatched, model_called
    status TEXT NOT NULL,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ==========================================
-- 9. NOTIFICATIONS INFRASTRUCTURE
-- ==========================================

-- A. notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'low', 'medium', 'high', 'critical')) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- B. notification_preferences
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    in_app_enabled BOOLEAN DEFAULT TRUE NOT NULL,
    email_enabled BOOLEAN DEFAULT TRUE NOT NULL,
    whatsapp_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    slack_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- C. notification_logs
CREATE TABLE notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
    channel TEXT NOT NULL, -- email, whatsapp, push
    status TEXT NOT NULL, -- delivered, failed
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ==========================================
-- 10. GOALS & LIFE OS INFRASTRUCTURE
-- ==========================================

-- A. goals
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    objective TEXT NOT NULL,
    description TEXT,
    time_horizon TEXT DEFAULT 'Q3' NOT NULL, -- Q1, Q2, Q3, Q4, Monthly, Annual
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100) NOT NULL,
    status TEXT DEFAULT 'ACTIVE' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- B. goal_progress_logs
CREATE TABLE goal_progress_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    previous_pct INTEGER NOT NULL,
    current_pct INTEGER NOT NULL,
    update_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- C. roadmap_items
CREATE TABLE roadmap_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    task_name TEXT NOT NULL,
    completion_pct INTEGER DEFAULT 0 CHECK (completion_pct >= 0 AND completion_pct <= 100) NOT NULL,
    status TEXT DEFAULT 'PENDING' NOT NULL, -- pending, active, completed
    target_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- D. execution_tasks
CREATE TABLE execution_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_item_id UUID NOT NULL REFERENCES roadmap_items(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'low', 'medium', 'high', 'critical')) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- E. productivity_logs
CREATE TABLE productivity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date DATE DEFAULT CURRENT_DATE NOT NULL,
    tasks_completed_count INTEGER DEFAULT 0 NOT NULL,
    focus_duration_minutes INTEGER DEFAULT 0 NOT NULL,
    energy_score INTEGER CHECK (energy_score >= 1 AND energy_score <= 10),
    productivity_score INTEGER CHECK (productivity_score >= 1 AND productivity_score <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, log_date)
);

-- F. life_os_entries
CREATE TABLE life_os_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- health, finance, learning, relationships
    note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ==========================================
-- 11. COMMUNICATIONS INFRASTRUCTURE
-- ==========================================

-- A. communication_logs
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

-- B. whatsapp_logs
CREATE TABLE whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    communication_log_id UUID NOT NULL REFERENCES communication_logs(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    message_sid TEXT UNIQUE,
    status TEXT NOT NULL, -- sent, delivered, read, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- C. email_logs
CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    communication_log_id UUID NOT NULL REFERENCES communication_logs(id) ON DELETE CASCADE,
    from_email TEXT NOT NULL,
    to_email TEXT NOT NULL,
    message_id TEXT UNIQUE,
    status TEXT NOT NULL, -- sent, delivered, bounce, opened
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- D. onboarding_requests (Public inbound lead generation)
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

-- ==========================================
-- 12. ANALYTICS INFRASTRUCTURE
-- ==========================================

-- A. analytics_events
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_category TEXT NOT NULL, -- page_view, interaction, api_call, authentication
    event_name TEXT NOT NULL,
    url_path TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- B. dashboard_metrics_cache
CREATE TABLE dashboard_metrics_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_key TEXT UNIQUE NOT NULL,
    metric_value JSONB NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- C. operational_insights
CREATE TABLE operational_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insight_type TEXT NOT NULL, -- efficiency_leak, financial_risk, automation_gain
    severity TEXT DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'low', 'medium', 'high', 'critical')) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    suggested_action TEXT,
    is_dismissed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ==========================================
-- 13. AUTOMATIC UPDATED_AT TRIGGERS CONFIG
-- ==========================================

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_client_contacts_updated_at BEFORE UPDATE ON client_contacts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_client_notes_updated_at BEFORE UPDATE ON client_notes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_project_milestones_updated_at BEFORE UPDATE ON project_milestones FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_project_tasks_updated_at BEFORE UPDATE ON project_tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_meeting_notes_updated_at BEFORE UPDATE ON meeting_notes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_agreements_updated_at BEFORE UPDATE ON agreements FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_ai_agents_updated_at BEFORE UPDATE ON ai_agents FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_ai_tasks_updated_at BEFORE UPDATE ON ai_tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_ai_workflows_updated_at BEFORE UPDATE ON ai_workflows FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_roadmap_items_updated_at BEFORE UPDATE ON roadmap_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_execution_tasks_updated_at BEFORE UPDATE ON execution_tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_life_os_entries_updated_at BEFORE UPDATE ON life_os_entries FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_onboarding_requests_updated_at BEFORE UPDATE ON onboarding_requests FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ==========================================
-- 14. PERFORMANCE OPTIMIZATION INDEXES
-- ==========================================

-- CRM Indexes
CREATE INDEX idx_clients_owner ON clients(owner_id);
CREATE INDEX idx_clients_status ON clients(retainer_status);
CREATE INDEX idx_client_contacts_client ON client_contacts(client_id);
CREATE INDEX idx_client_notes_client ON client_notes(client_id);

-- Project Indexes
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_milestones_project ON project_milestones(project_id);
CREATE INDEX idx_project_tasks_project ON project_tasks(project_id);
CREATE INDEX idx_project_tasks_milestone ON project_tasks(milestone_id);
CREATE INDEX idx_project_tasks_assignee ON project_tasks(assignee_id);

-- Meeting Indexes
CREATE INDEX idx_meetings_client ON meetings(client_id);
CREATE INDEX idx_meetings_start ON meetings(start_time);
CREATE INDEX idx_meeting_notes_meeting ON meeting_notes(meeting_id);
CREATE INDEX idx_meeting_reminders_time ON meeting_reminders(remind_at) WHERE is_sent = FALSE;

-- Invoice & Financial Indexes
CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_project ON invoices(project_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payment_milestones_project ON payment_milestones(project_id);

-- Document Indexes
CREATE INDEX idx_documents_client ON documents(client_id);
CREATE INDEX idx_documents_type ON documents(doc_type);
CREATE INDEX idx_document_versions_document ON document_versions(document_id);
CREATE INDEX idx_agreements_client ON agreements(client_id);
CREATE INDEX idx_proposals_agreement ON proposals(agreement_id);
CREATE INDEX idx_contracts_agreement ON contracts(agreement_id);
CREATE INDEX idx_ndas_agreement ON ndas(agreement_id);
CREATE INDEX idx_sow_documents_agreement ON sow_documents(agreement_id);

-- AI Ops Indexes
CREATE INDEX idx_ai_tasks_agent ON ai_tasks(agent_id);
CREATE INDEX idx_ai_tasks_status ON ai_tasks(status);
CREATE INDEX idx_ai_task_logs_task ON ai_task_logs(task_id);
CREATE INDEX idx_workflow_runs_workflow ON workflow_runs(workflow_id);
CREATE INDEX idx_automation_events_run ON automation_events(workflow_run_id);

-- Notifications Indexes
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notification_logs_notification ON notification_logs(notification_id);

-- Goals Indexes
CREATE INDEX idx_goals_owner ON goals(owner_id);
CREATE INDEX idx_roadmap_items_goal ON roadmap_items(goal_id);
CREATE INDEX idx_execution_tasks_roadmap ON execution_tasks(roadmap_item_id);
CREATE INDEX idx_productivity_logs_user_date ON productivity_logs(user_id, log_date);

-- Comms Indexes
CREATE INDEX idx_communication_logs_client ON communication_logs(client_id);
CREATE INDEX idx_communication_logs_user ON communication_logs(user_id);
CREATE INDEX idx_whatsapp_logs_comm ON whatsapp_logs(communication_log_id);
CREATE INDEX idx_email_logs_comm ON email_logs(communication_log_id);
CREATE INDEX idx_onboarding_requests_status ON onboarding_requests(status);

-- Analytics Indexes
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_category ON analytics_events(event_category);
CREATE INDEX idx_operational_insights_severity ON operational_insights(severity) WHERE is_dismissed = FALSE;

-- ==========================================
-- 15. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS everywhere
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_status_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_analytics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ndas ENABLE ROW LEVEL SECURITY;
ALTER TABLE sow_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_task_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE productivity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_os_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_metrics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE operational_insights ENABLE ROW LEVEL SECURITY;

-- Operator Rule: OPERATORS can perform all CRUD operations on ALL tables by default.
-- Client Rule: CLIENTS can view or update only their own linked resource records.

-- A. USERS & PROFILES
CREATE POLICY "Operators manage all profiles" ON user_profiles FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Users read their own profile" ON user_profiles FOR SELECT TO authenticated USING (id = auth.uid());

CREATE POLICY "Operators manage preferences" ON user_preferences FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Users manage their own preferences" ON user_preferences FOR ALL TO authenticated USING (user_id = auth.uid());

-- B. CRM INFRASTRUCTURE
CREATE POLICY "Operators manage clients" ON clients FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients select their own client record" ON clients FOR SELECT TO authenticated USING (email = auth.jwt()->>'email');

CREATE POLICY "Operators manage client contacts" ON client_contacts FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients select their own contacts" ON client_contacts FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

-- C. PROJECTS
CREATE POLICY "Operators manage projects" ON projects FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view their own projects" ON projects FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

CREATE POLICY "Operators manage project tasks" ON project_tasks FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view their project tasks" ON project_tasks FOR SELECT TO authenticated USING (
    project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email'))
);

-- D. MEETINGS
CREATE POLICY "Operators manage meetings" ON meetings FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view their own meetings" ON meetings FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

-- E. FINANCIALS
CREATE POLICY "Operators manage invoices" ON invoices FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view their own invoices" ON invoices FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

-- F. DOCUMENTS
CREATE POLICY "Operators manage documents" ON documents FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view their own documents" ON documents FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

-- G. AI OPERATIONS (Operator Only)
CREATE POLICY "Operators manage AI agents" ON ai_agents FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Operators manage AI tasks" ON ai_tasks FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Operators manage AI workflows" ON ai_workflows FOR ALL TO authenticated USING (is_operator(auth.uid()));

-- H. NOTIFICATIONS
CREATE POLICY "Operators manage notifications" ON notifications FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Users manage their own notifications" ON notifications FOR ALL TO authenticated USING (user_id = auth.uid());

-- I. GOALS (Operator Only)
CREATE POLICY "Operators manage goals" ON goals FOR ALL TO authenticated USING (is_operator(auth.uid()));

-- J. COMMUNICATIONS
CREATE POLICY "Operators manage communication logs" ON communication_logs FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view their communication logs" ON communication_logs FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

-- L. PUBLIC LEADS (onboarding_requests)
CREATE POLICY "Public visitor onboarding submissions" ON onboarding_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Operators manage onboarding requests" ON onboarding_requests FOR ALL TO authenticated USING (is_operator(auth.uid()));

-- ==========================================
// 16. MEETINGS & CLOSINGS INTELLIGENCE EXTENSIONS
-- ==========================================

-- A. closing_pipeline
CREATE TABLE closing_pipeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    stage TEXT NOT NULL CHECK (stage IN ('New Inquiry', 'Discovery Scheduled', 'Requirement Analysis', 'Proposal Sent', 'Negotiation', 'Payment Pending', 'Closed Won', 'Closed Lost')) DEFAULT 'New Inquiry',
    projected_revenue DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- B. follow_up_tasks
CREATE TABLE follow_up_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- C. scheduling_events
CREATE TABLE scheduling_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    platform TEXT NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- D. meeting_analytics_cache
CREATE TABLE meeting_analytics_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_key TEXT UNIQUE NOT NULL,
    metric_value JSONB NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Triggers for new tables
CREATE TRIGGER update_closing_pipeline_updated_at BEFORE UPDATE ON closing_pipeline FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_follow_up_tasks_updated_at BEFORE UPDATE ON follow_up_tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Indexes for performance tuning
CREATE INDEX idx_closing_pipeline_client ON closing_pipeline(client_id);
CREATE INDEX idx_closing_pipeline_stage ON closing_pipeline(stage);
CREATE INDEX idx_follow_up_tasks_client ON follow_up_tasks(client_id);
CREATE INDEX idx_follow_up_tasks_due ON follow_up_tasks(due_date);

-- Enable RLS
ALTER TABLE closing_pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduling_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_analytics_cache ENABLE ROW LEVEL SECURITY;

-- Secure RLS Policies
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

