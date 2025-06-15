
-- Créer la table pour les scénarios
CREATE TABLE public.scenarios (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  duration text NOT NULL,
  players text NOT NULL,
  description text NOT NULL,
  rules text[] NOT NULL,
  type text NOT NULL, -- 'short' or 'long'
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Activer la sécurité au niveau des lignes
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut lire les scénarios
CREATE POLICY "Public can read scenarios"
ON public.scenarios
FOR SELECT
USING (true);

-- Politique : Les administrateurs peuvent insérer des scénarios
CREATE POLICY "Admins can insert scenarios"
ON public.scenarios
FOR INSERT
WITH CHECK (public.is_current_user_admin());

-- Politique : Les administrateurs peuvent mettre à jour les scénarios
CREATE POLICY "Admins can update scenarios"
ON public.scenarios
FOR UPDATE
USING (public.is_current_user_admin());

-- Politique : Les administrateurs peuvent supprimer des scénarios
CREATE POLICY "Admins can delete scenarios"
ON public.scenarios
FOR DELETE
USING (public.is_current_user_admin());

-- Insérer les scénarios existants dans la nouvelle table
INSERT INTO public.scenarios (title, duration, players, description, rules, type) VALUES
('Capture de drapeau', '15-30 min', '10-20', 'Deux équipes doivent capturer le drapeau adverse tout en protégeant le leur.', '{"Une équipe gagne en ramenant le drapeau adverse à sa base", "Les joueurs éliminés reviennent en jeu après 5 minutes", "Le drapeau doit rester visible"}', 'short'),
('Dernier survivant', '10-20 min', '8-16', 'Tous contre tous jusqu''au dernier joueur en vie.', '{"Pas de réapparition", "Zone de jeu qui se réduit toutes les 5 minutes", "Pas d''alliance autorisée"}', 'short'),
('Contrôle de zone', '20-40 min', '12-24', 'Les équipes s''affrontent pour contrôler une zone centrale pendant une durée déterminée.', '{"Points accordés pour chaque minute de contrôle", "Réapparition à la base après élimination", "La zone doit être clairement définie"}', 'short'),
('Recherche & Destruction', '30-45 min', '14-28', 'Une équipe doit placer et défendre une bombe, l''autre doit la désamorcer.', '{"Temps limité pour placer la bombe", "La bombe explose après 5 minutes si non désamorcée", "Pas de réapparition une fois la bombe placée"}', 'short'),
('Escorte VIP', '2-3h', '20+', 'Une équipe doit escorter un VIP à travers plusieurs points de contrôle pendant que l''autre équipe tente de l''intercepter.', '{"Le VIP a 3 vies", "Points de respawn mobiles", "Objectifs secondaires donnant des avantages"}', 'long'),
('Guerre de territoire', '4-6h', '30+', 'Les équipes s''affrontent pour le contrôle de points stratégiques sur la carte.', '{"Points de contrôle à capturer", "Système de ressources", "Missions secondaires dynamiques"}', 'long'),
('Extraction d''otages', '3-4h', '24-40', 'Une équipe doit extraire des otages détenus par l''équipe adverse en utilisant des tactiques discrètes.', '{"Les otages doivent être escortés jusqu''à la zone d''extraction", "Les défenseurs ont des positions fortifiées", "Système de renseignements et de reconnaissance"}', 'long'),
('Opération Blackout', '5-7h', '30-50', 'Opération nocturne où les équipes doivent accomplir des objectifs secrets tout en évitant d''être détectées.', '{"Utilisation obligatoire de lampes tactiques ou NVG", "Objectifs révélés progressivement", "Système de patrouilles et d''alarmes"}', 'long'),
('Last Man Standing', '3-5h', '40+', 'Tous les joueurs commencent avec 3 vies et s''affrontent jusqu''à ce qu''il ne reste qu''un seul survivant.', '{"Zone de jeu qui se réduit progressivement", "Ravitaillement limité accessible à certains points", "Alliances temporaires autorisées mais un seul gagnant à la fin"}', 'long'),
('Infection Z', '2-4h', '30+', 'Quelques joueurs commencent comme ''infectés'' et doivent contaminer les survivants.', '{"Les infectés ont des vies illimitées", "Les survivants doivent accomplir des objectifs pour s''échapper", "Les survivants infectés rejoignent l''équipe des infectés"}', 'long');
