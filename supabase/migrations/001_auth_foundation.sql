-- Kairo OS Migration — 001 Auth Foundation
-- Setup core triggers, RBAC guards, user profiles, and preferences.

-- 1. GLOBAL PLUMBING & CORE FUNCTIONS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Roles Lookup Table
DROP TABLE IF EXISTS roles CASCADE;
CREATE TABLE roles (
    name TEXT PRIMARY KEY,
    level INTEGER NOT NULL UNIQUE
);

-- Seed hierarchical roles
INSERT INTO roles (name, level) VALUES
  ('owner', 100),
  ('admin', 80),
  ('operator', 60),
  ('assistant', 45),
  ('client', 10)
ON CONFLICT (name) DO NOTHING;

-- Hierarchical permission check helpers
CREATE OR REPLACE FUNCTION has_role_level(user_id UUID, required_level INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    user_role_level INTEGER;
BEGIN
    SELECT r.level INTO user_role_level
    FROM user_profiles p
    JOIN roles r ON p.role = r.name
    WHERE p.id = user_id;
    
    RETURN COALESCE(user_role_level >= required_level, FALSE);
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_owner(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN has_role_level(user_id, 100);
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN has_role_level(user_id, 80);
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_operator(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN has_role_level(user_id, 60);
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_assistant(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN has_role_level(user_id, 45);
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- 2. USERS & PREFERENCES TABLES
DROP TABLE IF EXISTS sessions_log CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'client' REFERENCES roles(name) ON UPDATE CASCADE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

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

CREATE TABLE sessions_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    location TEXT,
    login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    logout_at TIMESTAMP WITH TIME ZONE
);

-- 3. TRIGGERS
CREATE TRIGGER update_user_profiles_updated_at 
BEFORE UPDATE ON user_profiles 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at 
BEFORE UPDATE ON user_preferences 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 4. ROW LEVEL SECURITY
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions_log ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLICIES
CREATE POLICY "Allow public read access to roles lookup" ON roles FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Only owners manage roles lookup" ON roles FOR ALL TO authenticated USING (is_owner(auth.uid()));

CREATE POLICY "Operators manage all profiles" ON user_profiles FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Users read their own profile" ON user_profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users update their own profile details" ON user_profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "Operators manage preferences" ON user_preferences FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Users manage their own preferences" ON user_preferences FOR ALL TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Operators view sessions" ON sessions_log FOR ALL TO authenticated USING (is_operator(auth.uid()));
CREATE POLICY "Users view their sessions" ON sessions_log FOR SELECT TO authenticated USING (user_id = auth.uid());
