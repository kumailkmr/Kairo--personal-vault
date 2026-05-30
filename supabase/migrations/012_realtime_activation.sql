-- Kairo OS Migration — 012 Realtime Activation
-- Configures Supabase Realtime publication mappings for target operational tables.

-- 1. Recreate the supabase_realtime publication cleanly
DROP PUBLICATION IF EXISTS supabase_realtime;

CREATE PUBLICATION supabase_realtime FOR TABLE 
    clients, 
    projects, 
    meetings, 
    notifications, 
    invoices, 
    payments, 
    goals, 
    workflow_runs, 
    automation_events;
