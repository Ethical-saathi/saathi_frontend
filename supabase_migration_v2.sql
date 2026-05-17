-- ============================================================
-- AI SAATHI v2.0 — New Tables
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. TABLE: consent_records
-- Stores user consent choices (Layer 1 required, Layer 2 optional)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.consent_records (
    user_id             UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    layer1_agreed       BOOLEAN     NOT NULL DEFAULT FALSE,
    layer1_timestamp    TIMESTAMPTZ DEFAULT NULL,
    layer2_agreed       BOOLEAN     NOT NULL DEFAULT FALSE,
    layer2_timestamp    TIMESTAMPTZ DEFAULT NULL,
    layer2_withdrawn_at TIMESTAMPTZ DEFAULT NULL,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own consent"
ON public.consent_records FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consent"
ON public.consent_records FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own consent"
ON public.consent_records FOR UPDATE
USING (auth.uid() = user_id);


-- ============================================================
-- 2. TABLE: onboarding_profiles
-- Stores the 6-step onboarding data
-- ============================================================
CREATE TABLE IF NOT EXISTS public.onboarding_profiles (
    user_id                     UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name                TEXT        NOT NULL DEFAULT '',
    initial_mood                TEXT        DEFAULT NULL,
    open_q_responses            TEXT[]      DEFAULT ARRAY[]::TEXT[],
    tone_preference             TEXT        DEFAULT NULL,
    language                    TEXT        DEFAULT 'English',
    safety_contact_name         TEXT        DEFAULT NULL,
    safety_contact_relationship TEXT        DEFAULT NULL,
    safety_contact_phone        TEXT        DEFAULT NULL,
    onboarding_completed        BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at                  TIMESTAMPTZ DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.onboarding_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own onboarding"
ON public.onboarding_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding"
ON public.onboarding_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding"
ON public.onboarding_profiles FOR UPDATE
USING (auth.uid() = user_id);
