# MindEase Database Documentation

This document outlines the database tables, initialization SQL scripts, environment variables, and a guide on setting up Google OAuth with Supabase.

## 1. Environment Configuration (`.env`)

The application connects to Supabase using environment variables. These variables are consumed by `@/lib/supabaseClient.ts` to initialize the secure client.

Your local `.env` file should include the following variables:

```env
# Your unique Supabase project URL
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co

# The public anon key for frontend usage
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-publishable-anon-key

# (Optional) Service Role key for backend administrative tasks. 
# NEVER expose this key to the frontend (do not prefix with VITE_).
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> [!WARNING]
> Only `VITE_` prefixed variables are exposed to the frontend browser context. Never place private database keys in the Vite environment.

---

## 2. Database Schema (SQL Initialization)

You can run the following SQL script in the **Supabase SQL Editor** to automatically generate the required tables, Row Level Security (RLS) policies, helper functions, and triggers.

```sql
-- ============================================================
-- 1. TABLE: user_roles
-- ============================================================
CREATE TABLE public.user_roles (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         UUID            NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role            TEXT            NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    assigned_by     UUID            DEFAULT NULL,
    created_at      TIMESTAMPTZ     DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     DEFAULT NOW(),
    UNIQUE (user_id, role)
);

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all roles"
ON public.user_roles FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "Service role can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (true);


-- ============================================================
-- 2. TABLE: user_profiles
-- ============================================================
CREATE TABLE public.user_profiles (
    user_id             UUID            PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name          TEXT            NOT NULL DEFAULT '',
    email               TEXT            NOT NULL,
    avatar_url          TEXT            DEFAULT NULL,

    -- Session Preferences
    session_reminders   BOOLEAN         DEFAULT FALSE,
    reminder_time       TEXT            DEFAULT '09:00',
    reminder_days       TEXT[]          DEFAULT ARRAY['Mon', 'Wed', 'Fri'],
    show_mood_checkin   BOOLEAN         DEFAULT TRUE,

    -- Appearance
    chat_theme          TEXT            DEFAULT '#EDE6D3',

    -- Metadata
    created_at          TIMESTAMPTZ     DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     DEFAULT NOW()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
ON public.user_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON public.user_profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert profile"
ON public.user_profiles FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can read all profiles"
ON public.user_profiles FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);


-- ============================================================
-- 3. HELPER FUNCTION: is_admin()
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;


-- ============================================================
-- 4. TRIGGER: Auto-create profile + role on sign-up
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile from auth metadata
    INSERT INTO public.user_profiles (user_id, first_name, email)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            ''
        ),
        COALESCE(NEW.email, '')
    );

    -- Assign default 'user' role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
```

---

## 3. Integrating Google Auth (Google Cloud Console to Supabase)

To enable the "**Continue with Google**" button in your authentication flow, you must link Supabase with a project in Google Cloud Console.

### Step 1: Obtain the Supabase Callback URL
1. Go to your **Supabase Dashboard**.
2. Navigate to **Authentication** > **Providers**.
3. Click on **Google** and enable it.
4. Under "Callback URL (for OAuth)", you will see a URL looking like: 
   `https://<your-project-id>.supabase.co/auth/v1/callback`
   *(Copy this URL; you'll need it in Step 4).*

### Step 2: Configure Google Cloud Console
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click **Select a project** in the top navigation bar and click **New Project**. Name it "MindEase Auth".
3. Navigate to **APIs & Services** > **OAuth consent screen**:
   - Select **External** (unless you have a Google Workspace and want to restrict access).
   - Fill in the required fields (App Name, User Support Email, Developer Contact Email).
   - Save and continue through the `Scopes` and `Test users` steps without making complex modifications.
4. Navigate to **APIs & Services** > **Credentials**:
   - Click **+ CREATE CREDENTIALS** and select **OAuth client ID**.
   - Select **Web application** as the Application type.
   - Name it (e.g., "Supabase Auth Component").
   - Under **Authorized redirect URIs**, click **ADD URI** and paste the **Supabase Callback URL** from Step 1.
   - Click **Create**.

### Step 3: Link Credentials to Supabase
1. After creation in Google Cloud, a popup will display your **Client ID** and **Client Secret**.
2. Go back to your **Supabase Dashboard** > **Authentication** > **Providers** > **Google**.
3. Paste the **Client ID** and **Client Secret** into their respective fields.
4. Click **Save**.

> [!TIP]
> The codebase's `handleOAuth("google")` function inside `Auth.tsx` will now successfully launch the Google Sign-in popup and route the authenticated user to the Home page natively.
