-- Create documents table for government document management
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  file_url TEXT,
  file_type TEXT,
  category TEXT NOT NULL,
  keywords TEXT[],
  synonyms TEXT[],
  is_public BOOLEAN DEFAULT false,
  legal_basis TEXT,
  legal_restriction_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better search performance
CREATE INDEX IF NOT EXISTS idx_documents_keywords ON public.documents USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_documents_synonyms ON public.documents USING GIN(synonyms);
CREATE INDEX IF NOT EXISTS idx_documents_category ON public.documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_is_public ON public.documents(is_public);

-- Enable RLS for security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Allow public read access to public documents only
CREATE POLICY "Allow public read access to public documents" 
  ON public.documents FOR SELECT 
  USING (is_public = true);

-- Allow all operations for authenticated users (government employees)
CREATE POLICY "Allow authenticated users full access" 
  ON public.documents FOR ALL 
  USING (auth.role() = 'authenticated');
