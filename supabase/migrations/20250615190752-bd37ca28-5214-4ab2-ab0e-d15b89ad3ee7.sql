
-- Activer la sécurité au niveau des lignes pour la table des parties
ALTER TABLE public.airsoft_games ENABLE ROW LEVEL SECURITY;

-- Permettre aux utilisateurs connectés de créer des parties
CREATE POLICY "Users can create their own games"
ON public.airsoft_games
FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Permettre à tout le monde de voir les parties (pour la liste publique)
CREATE POLICY "Anyone can view games"
ON public.airsoft_games
FOR SELECT
USING (true);

-- Permettre aux créateurs de modifier leurs propres parties
CREATE POLICY "Game creators can update their own games"
ON public.airsoft_games
FOR UPDATE
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Permettre aux créateurs de supprimer leurs propres parties
CREATE POLICY "Game creators can delete their own games"
ON public.airsoft_games
FOR DELETE
USING (auth.uid() = created_by);
