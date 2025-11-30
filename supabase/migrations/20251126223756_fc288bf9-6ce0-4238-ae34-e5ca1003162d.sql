-- Drop the overly permissive SELECT policy that exposes security configuration
DROP POLICY IF EXISTS "All users can view geofencing rules" ON public.geofencing_rules;

-- Create a new restrictive policy - only CISO can view geofencing rules
-- The edge function uses service role key which bypasses RLS, so it will still work
CREATE POLICY "Only CISO can view geofencing rules" 
ON public.geofencing_rules 
FOR SELECT 
USING (has_role(auth.uid(), 'ciso'::app_role));