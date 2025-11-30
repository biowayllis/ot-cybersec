-- Create chart_annotations table
CREATE TABLE public.chart_annotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT 'hsl(var(--primary))',
  type TEXT NOT NULL DEFAULT 'event',
  chart_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chart_annotations ENABLE ROW LEVEL SECURITY;

-- Users can view their own annotations
CREATE POLICY "Users can view their own annotations"
ON public.chart_annotations
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own annotations
CREATE POLICY "Users can create their own annotations"
ON public.chart_annotations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own annotations
CREATE POLICY "Users can update their own annotations"
ON public.chart_annotations
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own annotations
CREATE POLICY "Users can delete their own annotations"
ON public.chart_annotations
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_chart_annotations_updated_at
BEFORE UPDATE ON public.chart_annotations
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();