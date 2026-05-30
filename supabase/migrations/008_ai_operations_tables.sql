-- Kairo OS Migration — 008 AI Operations Tables
-- Setup background AI agents orchestration, task logging, and cron/inbound automation workflow trackers.

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

CREATE TABLE ai_task_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES ai_tasks(id) ON DELETE CASCADE,
    log_level TEXT DEFAULT 'INFO' NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE ai_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    trigger_type TEXT NOT NULL, -- cron, inbound_hook, client_onboard, payment_overdue
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE workflow_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES ai_workflows(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'PENDING' NOT NULL, -- pending, executing, completed, failed
    execution_time_ms INTEGER DEFAULT 0 NOT NULL,
    metadata JSONB,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE automation_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_run_id UUID REFERENCES workflow_runs(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- step_completed, webhook_dispatched, model_called
    status TEXT NOT NULL,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- TRIGGERS
CREATE TRIGGER update_ai_agents_updated_at BEFORE UPDATE ON ai_agents FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_ai_tasks_updated_at BEFORE UPDATE ON ai_tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_ai_workflows_updated_at BEFORE UPDATE ON ai_workflows FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- INDEXES
CREATE INDEX idx_ai_tasks_agent ON ai_tasks(agent_id);
CREATE INDEX idx_ai_tasks_status ON ai_tasks(status);
CREATE INDEX idx_ai_task_logs_task ON ai_task_logs(task_id);
CREATE INDEX idx_workflow_runs_workflow ON workflow_runs(workflow_id);
CREATE INDEX idx_automation_events_run ON automation_events(workflow_run_id);

-- ROW LEVEL SECURITY
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_task_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_events ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES (Operators Only)
CREATE POLICY "Operators manage AI agents" ON ai_agents FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Operators manage AI tasks" ON ai_tasks FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Operators manage AI task logs" ON ai_task_logs FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Operators manage AI workflows" ON ai_workflows FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Operators manage workflow runs" ON workflow_runs FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Operators manage automation events" ON automation_events FOR ALL TO authenticated USING (is_operator(auth.uid()));
