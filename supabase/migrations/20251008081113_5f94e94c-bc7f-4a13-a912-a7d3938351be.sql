-- Fix all 10 security issues by blocking anonymous and public access to sensitive tables

-- 1. Secure profiles table (contains user emails, names, company names)
CREATE POLICY "profiles_block_anon_select"
ON public.profiles
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

CREATE POLICY "profiles_block_public_select"
ON public.profiles
AS RESTRICTIVE
FOR SELECT
TO public
USING (false);

-- 2. Secure invitations table (contains email addresses and invitation tokens)
CREATE POLICY "invitations_block_anon_select"
ON public.invitations
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

CREATE POLICY "invitations_block_public_select"
ON public.invitations
AS RESTRICTIVE
FOR SELECT
TO public
USING (false);

-- 3. Secure organizations table (contains organization names, domains, settings)
CREATE POLICY "organizations_block_anon_select"
ON public.organizations
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

CREATE POLICY "organizations_block_public_select"
ON public.organizations
AS RESTRICTIVE
FOR SELECT
TO public
USING (false);

-- 4. Secure campaigns table (contains campaign strategies, budgets, UTM parameters)
CREATE POLICY "campaigns_block_anon_select"
ON public.campaigns
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

CREATE POLICY "campaigns_block_public_select"
ON public.campaigns
AS RESTRICTIVE
FOR SELECT
TO public
USING (false);

-- 5. Secure campaign_metrics table (contains revenue, spend, conversions data)
CREATE POLICY "campaign_metrics_block_anon_select"
ON public.campaign_metrics
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

CREATE POLICY "campaign_metrics_block_public_select"
ON public.campaign_metrics
AS RESTRICTIVE
FOR SELECT
TO public
USING (false);

-- 6. Secure ad_accounts table (contains platform account IDs and names)
CREATE POLICY "ad_accounts_block_anon_select"
ON public.ad_accounts
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

CREATE POLICY "ad_accounts_block_public_select"
ON public.ad_accounts
AS RESTRICTIVE
FOR SELECT
TO public
USING (false);

-- 7. Secure alerts table (contains monitoring metrics and thresholds)
CREATE POLICY "alerts_block_anon_select"
ON public.alerts
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

CREATE POLICY "alerts_block_public_select"
ON public.alerts
AS RESTRICTIVE
FOR SELECT
TO public
USING (false);

-- 8. Secure attribution_settings table (contains attribution models and analytics)
CREATE POLICY "attribution_settings_block_anon_select"
ON public.attribution_settings
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

CREATE POLICY "attribution_settings_block_public_select"
ON public.attribution_settings
AS RESTRICTIVE
FOR SELECT
TO public
USING (false);

-- 9. Secure scheduled_reports table (contains recipient emails and report configs)
CREATE POLICY "scheduled_reports_block_anon_select"
ON public.scheduled_reports
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

CREATE POLICY "scheduled_reports_block_public_select"
ON public.scheduled_reports
AS RESTRICTIVE
FOR SELECT
TO public
USING (false);

-- 10. Secure user_roles table (contains user permissions and organizational relationships)
CREATE POLICY "user_roles_block_anon_select"
ON public.user_roles
AS RESTRICTIVE
FOR SELECT
TO anon
USING (false);

CREATE POLICY "user_roles_block_public_select"
ON public.user_roles
AS RESTRICTIVE
FOR SELECT
TO public
USING (false);