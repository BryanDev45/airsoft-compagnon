
-- Ajouter une colonne pour la photo du visage dans les demandes de vérification
ALTER TABLE public.verification_requests 
ADD COLUMN face_photo TEXT;

-- Créer un bucket de stockage pour les photos de vérification si il n'existe pas déjà
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'verification-photos', 
  'verification-photos', 
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Politiques RLS pour le bucket verification-photos
CREATE POLICY "Users can upload verification photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'verification-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own verification photos" ON storage.objects
FOR SELECT USING (
  bucket_id = 'verification-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all verification photos" ON storage.objects
FOR SELECT USING (
  bucket_id = 'verification-photos' AND
  is_current_user_admin()
);

CREATE POLICY "Users can update their own verification photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'verification-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own verification photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'verification-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
