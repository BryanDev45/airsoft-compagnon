
import { supabase } from '@/integrations/supabase/client';
import { GameParticipant } from '@/types/game';
import { Profile } from '@/types/profile';

// Fonction utilitaire pour extraire une valeur propre d'un champ potentiellement malformé
const extractCleanValue = (field: any): string | null => {
  console.log('📝 EXTRACT - Raw field:', field, 'Type:', typeof field);
  
  // Si c'est null ou undefined, retourner null
  if (field === null || field === undefined) {
    console.log('📝 EXTRACT - Field is null/undefined');
    return null;
  }
  
  // Si c'est un objet avec _type et value
  if (typeof field === 'object' && field._type !== undefined && field.value !== undefined) {
    console.log('📝 EXTRACT - Object with _type and value detected:', field);
    
    // Si la valeur est "undefined" (string), traiter comme null
    if (field.value === 'undefined' || field.value === null || field.value === undefined) {
      console.log('📝 EXTRACT - Value is undefined string or null');
      return null;
    }
    
    // Sinon retourner la valeur
    console.log('📝 EXTRACT - Returning value:', field.value);
    return String(field.value);
  }
  
  // Si c'est une chaîne
  if (typeof field === 'string') {
    // Si c'est "undefined" ou une chaîne vide, traiter comme null
    if (field === 'undefined' || field === '' || field.trim() === '') {
      console.log('📝 EXTRACT - String is undefined or empty');
      return null;
    }
    console.log('📝 EXTRACT - Returning string:', field);
    return field;
  }
  
  // Pour tout autre type, convertir en string si possible
  const stringValue = String(field);
  if (stringValue === 'undefined' || stringValue === '' || stringValue === 'null') {
    console.log('📝 EXTRACT - Converted string is invalid');
    return null;
  }
  
  console.log('📝 EXTRACT - Returning converted string:', stringValue);
  return stringValue;
};

export const fetchParticipants = async (gameId: string): Promise<GameParticipant[]> => {
  console.log('👥 PARTICIPANTS - Starting fetch for game:', gameId);
  
  // Récupérer les participants avec les profils en une seule requête
  const { data: participantsWithProfiles, error } = await supabase
    .from('game_participants')
    .select(`
      *,
      profiles:user_id (
        id,
        username,
        email,
        firstname,
        lastname,
        birth_date,
        age,
        join_date,
        avatar,
        banner,
        bio,
        location,
        phone_number,
        team,
        team_id,
        is_team_leader,
        is_verified,
        newsletter_subscribed,
        Admin,
        Ban,
        ban_date,
        ban_reason,
        banned_by,
        reputation,
        friends_list_public,
        spoken_language
      )
    `)
    .eq('game_id', gameId);

  if (error) {
    console.error('❌ PARTICIPANTS - Error fetching participants:', error);
    throw error;
  }

  console.log('✅ PARTICIPANTS - Raw participants with profiles fetched:', participantsWithProfiles?.length || 0);

  const participantsWithCompleteProfiles = await Promise.all(
    (participantsWithProfiles || []).map(async (participant, index) => {
      console.log(`🔍 PARTICIPANT ${index + 1} - Processing:`, {
        id: participant.id,
        user_id: participant.user_id,
        profile: participant.profiles
      });
      
      if (!participant.profiles) {
        console.warn(`⚠️ PARTICIPANT ${index + 1} - No profile found for user_id:`, participant.user_id);
        return {
          ...participant,
          profile: null
        } as GameParticipant;
      }

      let profile = participant.profiles as any;
      let teamName = null;

      // Nettoyer les données d'équipe avec la nouvelle fonction utilitaire
      const cleanTeamName = extractCleanValue(profile.team);
      const cleanTeamId = extractCleanValue(profile.team_id);
      
      console.log(`🏢 PARTICIPANT ${index + 1} - Cleaned team data:`, {
        originalTeam: profile.team,
        originalTeamId: profile.team_id,
        cleanTeamName,
        cleanTeamId
      });

      // Utiliser le nom d'équipe nettoyé s'il existe
      if (cleanTeamName) {
        teamName = cleanTeamName;
        console.log(`✅ PARTICIPANT ${index + 1} - Using cleaned team name:`, teamName);
      }
      // Si pas de nom mais on a un team_id valide, récupérer depuis la table teams
      else if (cleanTeamId) {
        console.log(`🔍 PARTICIPANT ${index + 1} - Fetching team name for clean team_id:`, cleanTeamId);
        
        try {
          const { data: teamData, error: teamError } = await supabase
            .from('teams')
            .select('name')
            .eq('id', cleanTeamId)
            .maybeSingle();

          if (teamError) {
            console.warn(`⚠️ PARTICIPANT ${index + 1} - Error fetching team:`, teamError);
          } else if (teamData && teamData.name) {
            teamName = teamData.name;
            console.log(`✅ PARTICIPANT ${index + 1} - Team name found:`, teamName);
          } else {
            console.log(`❌ PARTICIPANT ${index + 1} - No team found for team_id:`, cleanTeamId);
          }
        } catch (error) {
          console.warn(`❌ PARTICIPANT ${index + 1} - Unexpected error fetching team:`, error);
        }
      } else {
        console.log(`ℹ️ PARTICIPANT ${index + 1} - No valid team information available`);
      }

      // Construire le profil complet avec les données nettoyées
      const completeProfile: Profile = {
        ...profile,
        newsletter_subscribed: profile?.newsletter_subscribed ?? null,
        team: teamName, // Utiliser le nom d'équipe nettoyé ou null
        team_id: cleanTeamId, // Utiliser l'ID d'équipe nettoyé ou null
        team_logo: null // Ce champ n'existe pas dans la table profiles
      };

      console.log(`🎯 PARTICIPANT ${index + 1} - Final profile built:`, {
        username: completeProfile.username,
        team: completeProfile.team,
        team_id: completeProfile.team_id
      });

      return {
        ...participant,
        profile: completeProfile
      } as GameParticipant;
    })
  );

  console.log('🏁 PARTICIPANTS - Final participants with complete profiles:', participantsWithCompleteProfiles.length);
  
  // Log summary of team information
  const teamSummary = participantsWithCompleteProfiles.map((p, i) => ({
    participant: i + 1,
    username: p.profile?.username,
    team: p.profile?.team,
    team_id: p.profile?.team_id
  }));
  console.log('📊 PARTICIPANTS - Team summary:', teamSummary);
  
  return participantsWithCompleteProfiles;
};
