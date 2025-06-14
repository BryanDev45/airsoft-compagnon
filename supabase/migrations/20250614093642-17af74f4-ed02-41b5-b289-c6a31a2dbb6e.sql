
-- Ajouter les colonnes pour le numéro de téléphone et la langue parlée
ALTER TABLE public.profiles 
ADD COLUMN phone_number text,
ADD COLUMN spoken_language text;
