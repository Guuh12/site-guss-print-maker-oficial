
-- Create table for custom project requests
CREATE TABLE public.custom_project_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  description text NOT NULL,
  file_url text,
  file_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_project_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit a project request"
  ON public.custom_project_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create storage bucket for project files
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'project-files', true);

-- Allow anyone to upload to project-files bucket
CREATE POLICY "Anyone can upload project files"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'project-files');

-- Allow public read access
CREATE POLICY "Public read access for project files"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'project-files');
