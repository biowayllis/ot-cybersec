-- Add INSERT policy for user_devices
-- Allows users to insert their own device records
CREATE POLICY "Users can insert their own devices" 
ON public.user_devices 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add INSERT policy for user_sessions
-- Allows users to insert their own session records
CREATE POLICY "Users can insert their own sessions" 
ON public.user_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- For security_audit_log, we intentionally do NOT add a user INSERT policy
-- Audit logs should only be created by the system (via service role in edge functions)
-- Adding a user INSERT policy would allow users to forge audit entries
-- The edge function uses service role key which bypasses RLS