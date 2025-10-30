-- Create quotes table
CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  invoice_number TEXT NOT NULL,
  due_date DATE NOT NULL,
  notes TEXT,
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quote_items table
CREATE TABLE public.quote_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoice_items table
CREATE TABLE public.invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quotes
CREATE POLICY "Users can view their own quotes"
  ON public.quotes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quotes"
  ON public.quotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quotes"
  ON public.quotes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quotes"
  ON public.quotes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for invoices
CREATE POLICY "Users can view their own invoices"
  ON public.invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own invoices"
  ON public.invoices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices"
  ON public.invoices FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices"
  ON public.invoices FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for quote_items
CREATE POLICY "Users can view items of their quotes"
  ON public.quote_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.quotes
    WHERE quotes.id = quote_items.quote_id
    AND quotes.user_id = auth.uid()
  ));

CREATE POLICY "Users can create items for their quotes"
  ON public.quote_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.quotes
    WHERE quotes.id = quote_items.quote_id
    AND quotes.user_id = auth.uid()
  ));

CREATE POLICY "Users can update items of their quotes"
  ON public.quote_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.quotes
    WHERE quotes.id = quote_items.quote_id
    AND quotes.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete items of their quotes"
  ON public.quote_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.quotes
    WHERE quotes.id = quote_items.quote_id
    AND quotes.user_id = auth.uid()
  ));

-- RLS Policies for invoice_items
CREATE POLICY "Users can view items of their invoices"
  ON public.invoice_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.invoices
    WHERE invoices.id = invoice_items.invoice_id
    AND invoices.user_id = auth.uid()
  ));

CREATE POLICY "Users can create items for their invoices"
  ON public.invoice_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.invoices
    WHERE invoices.id = invoice_items.invoice_id
    AND invoices.user_id = auth.uid()
  ));

CREATE POLICY "Users can update items of their invoices"
  ON public.invoice_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.invoices
    WHERE invoices.id = invoice_items.invoice_id
    AND invoices.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete items of their invoices"
  ON public.invoice_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.invoices
    WHERE invoices.id = invoice_items.invoice_id
    AND invoices.user_id = auth.uid()
  ));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();