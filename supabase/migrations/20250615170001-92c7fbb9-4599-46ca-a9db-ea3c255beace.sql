
-- Create a storage bucket for badge icons if it doesn't exist.
INSERT INTO storage.buckets (id, name, public)
VALUES ('badge-icons', 'badge-icons', true)
ON CONFLICT (id) DO NOTHING;

-- Add RLS policies for the new bucket, if they don't exist.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Badge icons are publicly viewable' AND polrelid = 'storage.objects'::regclass) THEN
        CREATE POLICY "Badge icons are publicly viewable" ON storage.objects FOR SELECT USING ( bucket_id = 'badge-icons' );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can upload badge icons' AND polrelid = 'storage.objects'::regclass) THEN
        CREATE POLICY "Admins can upload badge icons" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'badge-icons' AND public.is_current_user_admin() );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can update badge icons' AND polrelid = 'storage.objects'::regclass) THEN
        CREATE POLICY "Admins can update badge icons" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'badge-icons' AND public.is_current_user_admin() );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can delete badge icons' AND polrelid = 'storage.objects'::regclass) THEN
        CREATE POLICY "Admins can delete badge icons" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'badge-icons' AND public.is_current_user_admin() );
    END IF;
END;
$$;

-- Enable RLS on badges table. This will show a notice if already enabled, which is fine.
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- Create policies for badges table, if they don't exist.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Public can read badges' AND polrelid = 'public.badges'::regclass) THEN
        CREATE POLICY "Public can read badges" ON public.badges FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Admins can manage badges' AND polrelid = 'public.badges'::regclass) THEN
        CREATE POLICY "Admins can manage badges" ON public.badges FOR ALL USING (public.is_current_user_admin()) WITH CHECK (public.is_current_user_admin());
    END IF;
END;
$$;
