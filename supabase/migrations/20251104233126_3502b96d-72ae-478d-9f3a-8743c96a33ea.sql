-- Add currency and service provider fields to invoices table
ALTER TABLE public.invoices
ADD COLUMN currency TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN provider_name TEXT,
ADD COLUMN provider_email TEXT,
ADD COLUMN provider_address TEXT;

-- Add currency and service provider fields to quotes table
ALTER TABLE public.quotes
ADD COLUMN currency TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN provider_name TEXT,
ADD COLUMN provider_email TEXT,
ADD COLUMN provider_address TEXT;

-- Create user_profiles table for storing default provider details
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  business_email TEXT,
  business_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_profiles
CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Add trigger for user_profiles updated_at
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();