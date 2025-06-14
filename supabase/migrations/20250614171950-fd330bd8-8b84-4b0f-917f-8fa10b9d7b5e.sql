
-- Table pour les signalements de profils utilisateur
CREATE TABLE public.user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reported_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les signalements de messages
CREATE TABLE public.message_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les demandes de vérification de compte
CREATE TABLE public.verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  front_id_document TEXT NOT NULL, -- URL du document recto
  back_id_document TEXT NOT NULL, -- URL du document verso
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id) -- Un utilisateur ne peut avoir qu'une seule demande à la fois
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les signalements d'utilisateurs
CREATE POLICY "Only admins can view user reports" 
  ON public.user_reports 
  FOR SELECT 
  USING (is_current_user_admin());

CREATE POLICY "Users can create user reports" 
  ON public.user_reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Only admins can update user reports" 
  ON public.user_reports 
  FOR UPDATE 
  USING (is_current_user_admin());

-- Politiques RLS pour les signalements de messages
CREATE POLICY "Only admins can view message reports" 
  ON public.message_reports 
  FOR SELECT 
  USING (is_current_user_admin());

CREATE POLICY "Users can create message reports" 
  ON public.message_reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Only admins can update message reports" 
  ON public.message_reports 
  FOR UPDATE 
  USING (is_current_user_admin());

-- Politiques RLS pour les demandes de vérification
CREATE POLICY "Admins can view all verification requests" 
  ON public.verification_requests 
  FOR SELECT 
  USING (is_current_user_admin());

CREATE POLICY "Users can view their own verification request" 
  ON public.verification_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create verification requests" 
  ON public.verification_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can update verification requests" 
  ON public.verification_requests 
  FOR UPDATE 
  USING (is_current_user_admin());
