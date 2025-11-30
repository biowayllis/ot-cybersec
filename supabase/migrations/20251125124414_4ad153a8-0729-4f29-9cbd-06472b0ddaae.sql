-- Create geofencing rules table
CREATE TABLE public.geofencing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('allow', 'block')),
  country_codes TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on geofencing_rules
ALTER TABLE public.geofencing_rules ENABLE ROW LEVEL SECURITY;

-- Policy: Only CISO can manage geofencing rules
CREATE POLICY "Only CISO can manage geofencing"
ON public.geofencing_rules
FOR ALL
USING (has_role(auth.uid(), 'ciso'::app_role))
WITH CHECK (has_role(auth.uid(), 'ciso'::app_role));

-- Policy: All authenticated users can view geofencing rules
CREATE POLICY "All users can view geofencing rules"
ON public.geofencing_rules
FOR SELECT
TO authenticated
USING (true);

-- Create geofencing exceptions table (for specific users who can bypass rules)
CREATE TABLE public.geofencing_exceptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  country_codes TEXT[] NOT NULL DEFAULT '{}',
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on geofencing_exceptions
ALTER TABLE public.geofencing_exceptions ENABLE ROW LEVEL SECURITY;

-- Policy: Only CISO can manage exceptions
CREATE POLICY "Only CISO can manage geofencing exceptions"
ON public.geofencing_exceptions
FOR ALL
USING (has_role(auth.uid(), 'ciso'::app_role))
WITH CHECK (has_role(auth.uid(), 'ciso'::app_role));

-- Policy: Users can view their own exceptions
CREATE POLICY "Users can view their own exceptions"
ON public.geofencing_exceptions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX idx_geofencing_rules_active ON public.geofencing_rules(is_active);
CREATE INDEX idx_geofencing_exceptions_user ON public.geofencing_exceptions(user_id);
CREATE INDEX idx_geofencing_exceptions_expires ON public.geofencing_exceptions(expires_at);

-- Create trigger for updated_at
CREATE TRIGGER update_geofencing_rules_updated_at
BEFORE UPDATE ON public.geofencing_rules
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();