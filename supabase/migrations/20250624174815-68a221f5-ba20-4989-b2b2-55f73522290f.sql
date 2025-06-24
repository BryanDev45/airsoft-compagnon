
-- Nettoyer les données corrompues dans la colonne team
UPDATE profiles 
SET team = NULL 
WHERE team::text LIKE '%_type%' 
   OR team::text LIKE '%undefined%'
   OR team::text = 'undefined';

-- Nettoyer les données corrompues dans la colonne team_id
-- En étant prudent avec les contraintes de politique
UPDATE profiles 
SET team_id = NULL 
WHERE team_id::text LIKE '%_type%' 
   OR team_id::text LIKE '%undefined%'
   OR team_id::text = 'undefined'
   OR (team_id IS NOT NULL AND NOT (team_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'));

-- Vérifier les résultats après nettoyage
SELECT COUNT(*) as corrupted_team_count
FROM profiles 
WHERE team::text LIKE '%_type%' 
   OR team::text LIKE '%undefined%';

SELECT COUNT(*) as corrupted_team_id_count
FROM profiles 
WHERE team_id::text LIKE '%_type%' 
   OR team_id::text LIKE '%undefined%';
