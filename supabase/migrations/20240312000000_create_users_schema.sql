-- Create profiles table that links to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    subscription_status TEXT CHECK (subscription_status IN ('active', 'inactive', 'past_due', 'canceled', 'trialing', 'incomplete')),
    subscription_tier TEXT CHECK (subscription_tier IN ('tier_1', 'tier_2', 'tier_3')),
    subscription_end_date TIMESTAMPTZ,
    is_financial_adviser BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Add subscription-related columns to existing profiles table
DO $$
BEGIN
    -- Add columns if they don't exist
    BEGIN
        ALTER TABLE public.profiles
            ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
            ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
            ADD COLUMN IF NOT EXISTS subscription_status TEXT,
            ADD COLUMN IF NOT EXISTS subscription_tier TEXT,
            ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ;
    EXCEPTION
        WHEN undefined_table THEN
            RAISE NOTICE 'Table profiles does not exist. Skipping column additions.';
    END;

    -- Add unique constraints if they don't exist
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'profiles'
    ) THEN
        -- Add unique constraints
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'profiles_stripe_customer_id_key'
        ) THEN
            ALTER TABLE public.profiles ADD CONSTRAINT profiles_stripe_customer_id_key
                UNIQUE (stripe_customer_id);
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'profiles_stripe_subscription_id_key'
        ) THEN
            ALTER TABLE public.profiles ADD CONSTRAINT profiles_stripe_subscription_id_key
                UNIQUE (stripe_subscription_id);
        END IF;

        -- Add check constraints
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'profiles_subscription_status_check'
        ) THEN
            ALTER TABLE public.profiles ADD CONSTRAINT profiles_subscription_status_check
                CHECK (subscription_status IS NULL OR
                      subscription_status IN ('active', 'inactive', 'past_due', 'canceled', 'trialing', 'incomplete'));
        END IF;

        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'profiles_subscription_tier_check'
        ) THEN
            ALTER TABLE public.profiles ADD CONSTRAINT profiles_subscription_tier_check
                CHECK (subscription_tier IS NULL OR
                      subscription_tier IN ('tier_1', 'tier_2', 'tier_3'));
        END IF;
    END IF;
END $$;

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add the updated_at trigger
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create a trigger to automatically create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();