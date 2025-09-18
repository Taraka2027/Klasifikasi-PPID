-- Create search logs table to track employee searches
CREATE TABLE IF NOT EXISTS public.search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_query TEXT NOT NULL,
  search_results_count INTEGER DEFAULT 0,
  employee_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert and view their own logs
CREATE POLICY "Allow authenticated users to manage search logs" 
  ON public.search_logs FOR ALL 
  USING (auth.role() = 'authenticated');
