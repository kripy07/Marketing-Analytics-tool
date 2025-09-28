-- Create enum types
CREATE TYPE public.user_role AS ENUM ('admin', 'viewer', 'billing');
CREATE TYPE public.campaign_status AS ENUM ('active', 'paused', 'completed', 'draft');
CREATE TYPE public.platform_type AS ENUM ('google_ads', 'facebook_ads', 'linkedin_ads', 'twitter_ads', 'tiktok_ads', 'other');
CREATE TYPE public.attribution_model AS ENUM ('first_touch', 'last_touch', 'linear', 'time_decay');
CREATE TYPE public.notification_type AS ENUM ('email', 'sms', 'slack');
CREATE TYPE public.alert_condition AS ENUM ('greater_than', 'less_than', 'equals', 'percentage_change');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    company_name TEXT,
    avatar_url TEXT,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create organizations table
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user roles for organizations
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, organization_id)
);

-- Create ad accounts table
CREATE TABLE public.ad_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    platform platform_type NOT NULL,
    account_id TEXT NOT NULL,
    account_name TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaigns table
CREATE TABLE public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    ad_account_id UUID REFERENCES public.ad_accounts(id) ON DELETE CASCADE,
    platform_campaign_id TEXT,
    name TEXT NOT NULL,
    status campaign_status DEFAULT 'draft',
    budget DECIMAL(10,2),
    start_date DATE,
    end_date DATE,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaign metrics table
CREATE TABLE public.campaign_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    spend DECIMAL(10,2) DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, date)
);

-- Create attribution models table
CREATE TABLE public.attribution_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    model attribution_model DEFAULT 'last_touch',
    lookback_window_days INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id)
);

-- Create alerts table
CREATE TABLE public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    metric TEXT NOT NULL, -- 'spend', 'cpa', 'conversion_rate', etc.
    condition alert_condition NOT NULL,
    threshold_value DECIMAL(10,2) NOT NULL,
    notification_types notification_type[] DEFAULT ARRAY[]::notification_type[],
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scheduled reports table
CREATE TABLE public.scheduled_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    report_config JSONB NOT NULL,
    schedule_cron TEXT NOT NULL, -- cron expression
    recipients TEXT[] NOT NULL,
    last_sent_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invitations table
CREATE TABLE public.invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'viewer',
    token UUID DEFAULT gen_random_uuid(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
    accepted_at TIMESTAMP WITH TIME ZONE,
    invited_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribution_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Organizations: Users can access organizations they belong to
CREATE POLICY "Users can view their organizations" ON public.organizations
    FOR SELECT USING (
        id IN (
            SELECT organization_id FROM public.user_roles 
            WHERE user_id = auth.uid()
        )
    );

-- User roles: Users can view roles in their organizations
CREATE POLICY "Users can view roles in their orgs" ON public.user_roles
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM public.user_roles 
            WHERE user_id = auth.uid()
        )
    );

-- Ad accounts: Users can access ad accounts in their organizations
CREATE POLICY "Users can access org ad accounts" ON public.ad_accounts
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM public.user_roles 
            WHERE user_id = auth.uid()
        )
    );

-- Campaigns: Users can access campaigns in their organizations
CREATE POLICY "Users can access org campaigns" ON public.campaigns
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM public.user_roles 
            WHERE user_id = auth.uid()
        )
    );

-- Campaign metrics: Users can access metrics for their org campaigns
CREATE POLICY "Users can access org campaign metrics" ON public.campaign_metrics
    FOR ALL USING (
        campaign_id IN (
            SELECT c.id FROM public.campaigns c
            JOIN public.user_roles ur ON c.organization_id = ur.organization_id
            WHERE ur.user_id = auth.uid()
        )
    );

-- Attribution settings: Users can access settings for their organizations
CREATE POLICY "Users can access org attribution settings" ON public.attribution_settings
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM public.user_roles 
            WHERE user_id = auth.uid()
        )
    );

-- Alerts: Users can access alerts for their organizations
CREATE POLICY "Users can access org alerts" ON public.alerts
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM public.user_roles 
            WHERE user_id = auth.uid()
        )
    );

-- Scheduled reports: Users can access reports for their organizations
CREATE POLICY "Users can access org reports" ON public.scheduled_reports
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM public.user_roles 
            WHERE user_id = auth.uid()
        )
    );

-- Invitations: Users can view invitations for their organizations (if admin)
CREATE POLICY "Admins can manage invitations" ON public.invitations
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Create functions and triggers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data ->> 'first_name',
        NEW.raw_user_meta_data ->> 'last_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers for tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ad_accounts_updated_at BEFORE UPDATE ON public.ad_accounts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attribution_settings_updated_at BEFORE UPDATE ON public.attribution_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON public.alerts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scheduled_reports_updated_at BEFORE UPDATE ON public.scheduled_reports
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();