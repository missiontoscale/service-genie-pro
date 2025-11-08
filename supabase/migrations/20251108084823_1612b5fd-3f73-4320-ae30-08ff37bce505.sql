-- Add category column to invoices table for client organization
ALTER TABLE public.invoices
ADD COLUMN category TEXT;

-- Add index for faster category filtering
CREATE INDEX idx_invoices_category ON public.invoices(category);

-- Add category column to quotes table for consistency
ALTER TABLE public.quotes
ADD COLUMN category TEXT;

-- Add index for faster category filtering on quotes
CREATE INDEX idx_quotes_category ON public.quotes(category);

-- Enhance user_profiles table with additional fields
ALTER TABLE public.user_profiles
ADD COLUMN full_name TEXT,
ADD COLUMN company_logo TEXT,
ADD COLUMN location TEXT;

-- Create storage bucket for user logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-logos', 'user-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for user logos
CREATE POLICY "Logo images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-logos');

CREATE POLICY "Users can upload their own logo"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'user-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own logo"
ON storage.objects FOR UPDATE
USING (bucket_id = 'user-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own logo"
ON storage.objects FOR DELETE
USING (bucket_id = 'user-logos' AND auth.uid()::text = (storage.foldername(name))[1]);