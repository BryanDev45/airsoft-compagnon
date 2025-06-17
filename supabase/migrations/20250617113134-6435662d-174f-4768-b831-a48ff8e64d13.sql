
-- Créer une table pour les statistiques du bot Discord
CREATE TABLE IF NOT EXISTS discord_bot_stats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  download_count integer DEFAULT 0,
  invite_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Créer une table pour les statistiques PWA
CREATE TABLE IF NOT EXISTS pwa_stats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  install_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Créer une table pour les statistiques de visite des pages
CREATE TABLE IF NOT EXISTS page_visit_stats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path text NOT NULL,
  visit_count integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insérer des données initiales pour le bot Discord
INSERT INTO discord_bot_stats (download_count, invite_count) 
VALUES (0, 0) 
ON CONFLICT DO NOTHING;

-- Insérer des données initiales pour la PWA
INSERT INTO pwa_stats (install_count) 
VALUES (0) 
ON CONFLICT DO NOTHING;

-- Insérer quelques pages principales pour les statistiques de visite
INSERT INTO page_visit_stats (page_path, visit_count, unique_visitors) 
VALUES 
  ('/', 0, 0),
  ('/parties', 0, 0),
  ('/toolbox', 0, 0),
  ('/admin', 0, 0)
ON CONFLICT DO NOTHING;
