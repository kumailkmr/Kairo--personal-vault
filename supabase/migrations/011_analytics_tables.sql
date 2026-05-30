-- Kairo OS Migration — 011 Analytics Tables
-- Setup telemetry analytics event logging, aggregation KPI caches, and background business intelligence insights.

CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_category TEXT NOT NULL, -- page_view, interaction, api_call, authentication
    event_name TEXT NOT NULL,
    url_path TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE dashboard_metrics_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_key TEXT UNIQUE NOT NULL,
    metric_value JSONB NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

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

-- INDEXES
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_category ON analytics_events(event_category);
CREATE INDEX idx_operational_insights_severity ON operational_insights(severity) WHERE is_dismissed = FALSE;

-- ROW LEVEL SECURITY
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_metrics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE operational_insights ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Operators manage analytics events" ON analytics_events FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Users insert their own analytics" ON analytics_events FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Operators manage dashboard metrics cache" ON dashboard_metrics_cache FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Operators manage operational insights" ON operational_insights FOR ALL TO authenticated USING (is_operator(auth.uid()));
