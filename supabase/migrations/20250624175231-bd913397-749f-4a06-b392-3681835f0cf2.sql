
-- Nettoyer toutes les données corrompues dans la colonne team
UPDATE profiles 
SET team = NULL 
WHERE team IS NOT NULL 
  AND (
    team::text LIKE '%_type%' 
    OR team::text LIKE '%undefined%'
    OR team::text = 'undefined'
    OR team::text = 'null'
    OR team::text = ''
  );

-- Nettoyer toutes les données corrompues dans la colonne team_id
UPDATE profiles 
SET team_id = NULL 
WHERE team_id IS NOT NULL 
  AND (
    team_id::text LIKE '%_type%' 
    OR team_id::text LIKE '%undefined%'
    OR team_id::text = 'undefined'
    OR team_id::text = 'null'
    OR team_id::text = ''
    OR NOT (team_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
  );

-- Mettre à jour les noms d'équipe manquants pour les profils qui ont un team_id valide
UPDATE profiles 
SET team = (SELECT name FROM teams WHERE teams.id = profiles.team_id)
WHERE team_id IS NOT NULL 
  AND team IS NULL 
  AND EXISTS (SELECT 1 FROM teams WHERE teams.id = profiles.team_id);

-- Nettoyer les team_id qui pointent vers des équipes inexistantes
UPDATE profiles 
SET team_id = NULL, team = NULL
WHERE team_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM teams WHERE teams.id = profiles.team_id);

-- Vérifier les résultats après nettoyage
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN team IS NOT NULL THEN 1 END) as profiles_with_team_name,
  COUNT(CASE WHEN team_id IS NOT NULL THEN 1 END) as profiles_with_team_id,
  COUNT(CASE WHEN team IS NOT NULL AND team_id IS NULL THEN 1 END) as orphaned_team_names,
  COUNT(CASE WHEN team IS NULL AND team_id IS NOT NULL THEN 1 END) as missing_team_names
FROM profiles;
