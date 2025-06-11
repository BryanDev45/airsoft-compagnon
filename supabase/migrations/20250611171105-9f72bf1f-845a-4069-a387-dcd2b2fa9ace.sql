
-- Ajouter une colonne end_date à la table airsoft_games
ALTER TABLE public.airsoft_games 
ADD COLUMN end_date date;

-- Mettre à jour les parties existantes pour définir end_date = date par défaut
UPDATE public.airsoft_games 
SET end_date = date 
WHERE end_date IS NULL;
