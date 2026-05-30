-- Kairo OS Migration — 003 Projects Tables
-- Setup Projects, tasks, milestones, storage links, and status logs.

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

CREATE TABLE project_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE project_status_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- TRIGGERS
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_project_milestones_updated_at BEFORE UPDATE ON project_milestones FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_project_tasks_updated_at BEFORE UPDATE ON project_tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- INDEXES
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_milestones_project ON project_milestones(project_id);
CREATE INDEX idx_project_tasks_project ON project_tasks(project_id);
CREATE INDEX idx_project_tasks_milestone ON project_tasks(milestone_id);
CREATE INDEX idx_project_tasks_assignee ON project_tasks(assignee_id);

-- ROW LEVEL SECURITY
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_status_logs ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Operators manage projects" ON projects FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view their own projects" ON projects FOR SELECT TO authenticated USING (
    client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email')
);

CREATE POLICY "Operators manage milestones" ON project_milestones FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view project milestones" ON project_milestones FOR SELECT TO authenticated USING (
    project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email'))
);

CREATE POLICY "Operators manage tasks" ON project_tasks FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view project tasks" ON project_tasks FOR SELECT TO authenticated USING (
    project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email'))
);

CREATE POLICY "Operators manage assets" ON project_assets FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view project assets" ON project_assets FOR SELECT TO authenticated USING (
    project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email'))
);

CREATE POLICY "Operators manage status logs" ON project_status_logs FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients view status logs" ON project_status_logs FOR SELECT TO authenticated USING (
    project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE email = auth.jwt()->>'email'))
);
