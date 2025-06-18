
-- Ajouter une colonne is_hidden à la table badges
ALTER TABLE public.badges 
ADD COLUMN is_hidden BOOLEAN DEFAULT FALSE;

-- Mettre à jour la fonction RLS pour les badges si nécessaire
COMMENT ON COLUMN public.badges.is_hidden IS 'Indique si le badge est caché dans la liste des badges disponibles pour les utilisateurs non-débloqués';
