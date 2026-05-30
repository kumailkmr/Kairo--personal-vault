-- Kairo OS Migration — 009 Goals & Life OS Tables
-- Setup strategic objective setting, roadmap milestone items, execution tasks, and productivity/health logs.

DROP TABLE IF EXISTS life_os_entries CASCADE;
DROP TABLE IF EXISTS productivity_logs CASCADE;
DROP TABLE IF EXISTS execution_tasks CASCADE;
DROP TABLE IF EXISTS roadmap_items CASCADE;
DROP TABLE IF EXISTS goal_progress_logs CASCADE;
DROP TABLE IF EXISTS goals CASCADE;

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

CREATE TABLE goal_progress_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    previous_pct INTEGER NOT NULL,
    current_pct INTEGER NOT NULL,
    update_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

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

CREATE TABLE life_os_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- health, finance, learning, relationships
    note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- TRIGGERS
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_roadmap_items_updated_at BEFORE UPDATE ON roadmap_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_execution_tasks_updated_at BEFORE UPDATE ON execution_tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_life_os_entries_updated_at BEFORE UPDATE ON life_os_entries FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- INDEXES
CREATE INDEX idx_goals_owner ON goals(owner_id);
CREATE INDEX idx_roadmap_items_goal ON roadmap_items(goal_id);
CREATE INDEX idx_execution_tasks_roadmap ON execution_tasks(roadmap_item_id);
CREATE INDEX idx_productivity_logs_user_date ON productivity_logs(user_id, log_date);

-- ROW LEVEL SECURITY
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE productivity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_os_entries ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Operators manage goals" ON goals FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients read goals" ON goals FOR SELECT TO authenticated USING (owner_id = auth.uid());

CREATE POLICY "Operators manage progress logs" ON goal_progress_logs FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients read progress logs" ON goal_progress_logs FOR SELECT TO authenticated USING (
    goal_id IN (SELECT id FROM goals WHERE owner_id = auth.uid())
);

CREATE POLICY "Operators manage roadmap items" ON roadmap_items FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients read roadmap items" ON roadmap_items FOR SELECT TO authenticated USING (
    goal_id IN (SELECT id FROM goals WHERE owner_id = auth.uid())
);

CREATE POLICY "Operators manage execution tasks" ON execution_tasks FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Clients read execution tasks" ON execution_tasks FOR SELECT TO authenticated USING (
    roadmap_item_id IN (SELECT id FROM roadmap_items WHERE goal_id IN (SELECT id FROM goals WHERE owner_id = auth.uid()))
);

CREATE POLICY "Operators manage productivity logs" ON productivity_logs FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Users manage productivity logs" ON productivity_logs FOR ALL TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Operators manage life OS" ON life_os_entries FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Users manage life OS" ON life_os_entries FOR ALL TO authenticated USING (user_id = auth.uid());
