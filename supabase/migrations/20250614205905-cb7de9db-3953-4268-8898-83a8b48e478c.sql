
-- Ajouter une politique RLS pour permettre aux admins de supprimer les demandes de vérification
CREATE POLICY "Only admins can delete verification requests" 
  ON public.verification_requests 
  FOR DELETE 
  USING (is_current_user_admin());
