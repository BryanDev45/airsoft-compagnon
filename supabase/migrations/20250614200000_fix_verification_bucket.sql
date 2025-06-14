
-- S'assurer que le bucket verification-photos existe et est correctement configuré
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'verification-photos', 
  'verification-photos', 
  false, -- Bucket privé pour la sécurité
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']::text[];

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can upload verification photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own verification photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all verification photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own verification photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own verification photos" ON storage.objects;

-- Recréer les politiques avec des noms uniques
CREATE POLICY "verification_upload_policy" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'verification-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "verification_view_own_policy" ON storage.objects
FOR SELECT USING (
  bucket_id = 'verification-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "verification_admin_view_policy" ON storage.objects
FOR SELECT USING (
  bucket_id = 'verification-photos' AND
  is_current_user_admin()
);

CREATE POLICY "verification_update_policy" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'verification-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "verification_delete_policy" ON storage.objects
FOR DELETE USING (
  bucket_id = 'verification-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
