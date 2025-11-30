-- Add category and tags columns to chart_annotations
ALTER TABLE public.chart_annotations 
ADD COLUMN category text DEFAULT 'general',
ADD COLUMN tags text[] DEFAULT '{}';

-- Create index for tags to improve filtering performance
CREATE INDEX idx_chart_annotations_tags ON public.chart_annotations USING GIN(tags);
CREATE INDEX idx_chart_annotations_category ON public.chart_annotations(category);