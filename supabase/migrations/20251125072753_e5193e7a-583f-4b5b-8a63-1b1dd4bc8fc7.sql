-- Add geolocation columns to security_audit_log
ALTER TABLE public.security_audit_log 
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS country_code text,
ADD COLUMN IF NOT EXISTS region text,
ADD COLUMN IF NOT EXISTS is_high_risk boolean DEFAULT false;

-- Create index for location queries
CREATE INDEX IF NOT EXISTS idx_security_audit_log_location ON public.security_audit_log(country_code, is_high_risk);