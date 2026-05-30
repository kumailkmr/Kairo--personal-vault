-- Kairo OS Migration — 010 Notifications Tables
-- Setup real-time signaling, priority alerts, user preferences, and outbox delivery logging.

DROP TABLE IF EXISTS notification_logs CASCADE;
DROP TABLE IF EXISTS notification_preferences CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

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

CREATE TABLE notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
    channel TEXT NOT NULL, -- email, whatsapp, push
    status TEXT NOT NULL, -- delivered, failed
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- TRIGGERS
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- INDEXES
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notification_logs_notification ON notification_logs(notification_id);

-- ROW LEVEL SECURITY
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Operators manage notifications" ON notifications FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Users manage their own notifications" ON notifications FOR ALL TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Operators manage notification preferences" ON notification_preferences FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Users manage their own notification preferences" ON notification_preferences FOR ALL TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Operators manage notification logs" ON notification_logs FOR ALL TO authenticated USING (is_operator(auth.uid()));
