-- Add sharing columns to chart_annotations
ALTER TABLE public.chart_annotations
ADD COLUMN is_shared BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN shared_by_name TEXT;

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Users can view their own annotations" ON public.chart_annotations;

-- Create new SELECT policy that allows viewing own annotations OR shared annotations
CREATE POLICY "Users can view own or shared annotations"
ON public.chart_annotations
FOR SELECT
USING (auth.uid() = user_id OR is_shared = true);