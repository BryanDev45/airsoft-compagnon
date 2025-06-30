
-- Ajouter les colonnes ville et code postal à la table team_fields
ALTER TABLE public.team_fields 
ADD COLUMN city TEXT,
ADD COLUMN zip_code TEXT;
