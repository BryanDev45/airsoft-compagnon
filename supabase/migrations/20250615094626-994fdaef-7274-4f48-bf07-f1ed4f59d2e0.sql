
-- Créer la table pour le glossaire
CREATE TABLE public.glossary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT term_unique UNIQUE (term)
);

-- Activer la sécurité au niveau des lignes (RLS)
ALTER TABLE public.glossary ENABLE ROW LEVEL SECURITY;

-- Permettre à tout le monde de lire les termes du glossaire
CREATE POLICY "Public can read glossary terms"
  ON public.glossary
  FOR SELECT
  USING (true);

-- Permettre aux administrateurs d'insérer de nouveaux termes
CREATE POLICY "Admins can insert glossary terms"
  ON public.glossary
  FOR INSERT
  WITH CHECK (public.is_current_user_admin());

-- Permettre aux administrateurs de mettre à jour les termes
CREATE POLICY "Admins can update glossary terms"
  ON public.glossary
  FOR UPDATE
  USING (public.is_current_user_admin());

-- Permettre aux administrateurs de supprimer les termes
CREATE POLICY "Admins can delete glossary terms"
  ON public.glossary
  FOR DELETE
  USING (public.is_current_user_admin());

-- Insérer les termes existants dans la nouvelle table
INSERT INTO public.glossary (term, definition, category) VALUES
  ('AEG', 'Airsoft Electric Gun - Réplique airsoft électrique équipée d''un moteur et d''une batterie.', 'Équipement'),
  ('FPS', 'Feet Per Second - Unité de mesure de la vitesse de sortie des billes (1 FPS = 0.3048 m/s).', 'Mesure'),
  ('Hop-up', 'Système appliquant un effet rétro-rotatif à la bille pour augmenter sa portée.', 'Technique'),
  ('GBB', 'Gas Blow Back - Réplique à gaz avec système de recul simulant le fonctionnement d''une vraie arme.', 'Équipement'),
  ('DMR', 'Designated Marksman Rifle - Réplique de précision semi-automatique à puissance intermédiaire.', 'Équipement'),
  ('ROF', 'Rate Of Fire - Cadence de tir d''une réplique, mesurée en billes par seconde ou par minute.', 'Mesure'),
  ('LiPo', 'Lithium Polymer - Type de batterie rechargeable couramment utilisée en airsoft.', 'Équipement'),
  ('MED', 'Minimum Engagement Distance - Distance minimale de tir requise pour des répliques puissantes.', 'Règles'),
  ('CQB', 'Close Quarters Battle - Combat rapproché, généralement en intérieur ou zones urbaines.', 'Tactique'),
  ('Mosfet', 'Composant électronique qui protège les contacts du sélecteur de tir et permet des fonctions avancées.', 'Technique'),
  ('Milsim', 'Military Simulation - Simulation militaire avec équipement et règles réalistes.', 'Type de jeu'),
  ('Spring', 'Réplique à ressort nécessitant un réarmement manuel entre chaque tir.', 'Équipement'),
  ('Bucking', 'Joint en caoutchouc du hop-up qui applique l''effet Magnus à la bille.', 'Technique'),
  ('NPAS', 'Negative Pressure Air System - Système permettant d''ajuster la puissance des répliques GBB.', 'Technique'),
  ('Sear', 'Pièce mécanique qui retient le piston avant le tir dans une gearbox.', 'Technique'),
  ('Cut-off lever', 'Levier qui arrête le cycle de la gearbox en mode semi-auto.', 'Technique'),
  ('Anti-reversal latch', 'Cliquet anti-retour qui empêche la gearbox de tourner en sens inverse.', 'Technique'),
  ('Delayer chip', 'Pièce qui retarde l''alimentation des billes pour éviter les bourages.', 'Technique'),
  ('Tappet plate', 'Plaque qui synchronise l''alimentation des billes avec le cycle de la gearbox.', 'Technique'),
  ('HPA', 'High Pressure Air - Système utilisant de l''air comprimé pour propulser les billes, offrant une cadence et une précision élevées.', 'Équipement'),
  ('Green Gas', 'Mélange gazeux à base de propane utilisé pour alimenter les répliques à gaz.', 'Équipement'),
  ('Blowback', 'Système de recul simulant le mouvement de la culasse sur les répliques à gaz ou électriques.', 'Technique'),
  ('Speedloader', 'Accessoire permettant de charger rapidement les chargeurs de répliques.', 'Accessoire'),
  ('Réglage VSR', 'Méthode de réglage précis du hop-up basée sur le système VSR-10 de Tokyo Marui.', 'Technique'),
  ('Shimming', 'Ajustement précis des engrenages dans une gearbox pour optimiser son fonctionnement.', 'Maintenance'),
  ('AOE', 'Angle of Engagement - Angle de contact entre les dents du piston et du secteur gear, crucial pour l''efficacité mécanique.', 'Technique'),
  ('Reshim', 'Procédure de réajustement des cales d''engrenages pour optimiser le fonctionnement de la gearbox.', 'Maintenance'),
  ('R-hop', 'Modification avancée du hop-up offrant une meilleure stabilité et portée des billes.', 'Technique'),
  ('IPSC', 'International Practical Shooting Confederation - Type de compétition de tir dynamique adaptée à l''airsoft.', 'Compétition'),
  ('UKARA', 'United Kingdom Airsoft Retailers Association - Système de régulation britannique pour l''achat de répliques.', 'Réglementation'),
  ('TDM', 'Team Death Match - Format de jeu où deux équipes s''affrontent jusqu''à élimination ou limite de temps.', 'Type de jeu'),
  ('BBs', 'Désignation courante des billes d''airsoft, généralement en plastique et de différents poids.', 'Équipement'),
  ('Joule Creep', 'Phénomène où l''énergie cinétique d''une bille augmente au-delà de la valeur mesurée au chronographe.', 'Technique');
