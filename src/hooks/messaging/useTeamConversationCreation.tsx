
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook pour la création automatique de conversations d'équipe
 */
export const useTeamConversationCreation = () => {
  const createTeamConversationIfNeeded = async (teamId: string, teamName: string) => {
    try {
      // Vérifier si une conversation d'équipe existe déjà
      const { data: existingConversation, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .eq('type', 'team')
        .eq('team_id', teamId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing team conversation:', checkError);
        return;
      }

      if (!existingConversation) {
        console.log(`Creating team conversation for team: ${teamName}`);
        
        // Créer la conversation d'équipe
        const { data: newConversation, error: conversationError } = await supabase
          .from('conversations')
          .insert({
            type: 'team',
            name: `Équipe ${teamName}`,
            team_id: teamId
          })
          .select('id')
          .single();

        if (conversationError) {
          console.error('Error creating team conversation:', conversationError);
          return;
        }

        // Ajouter tous les membres confirmés de l'équipe à la conversation
        const { data: teamMembers, error: membersError } = await supabase
          .from('team_members')
          .select('user_id')
          .eq('team_id', teamId)
          .eq('status', 'confirmed');

        if (membersError) {
          console.error('Error fetching team members:', membersError);
          return;
        }

        if (teamMembers && teamMembers.length > 0) {
          const participants = teamMembers.map(member => ({
            conversation_id: newConversation.id,
            user_id: member.user_id
          }));

          const { error: participantsError } = await supabase
            .from('conversation_participants')
            .insert(participants);

          if (participantsError) {
            console.error('Error adding participants to team conversation:', participantsError);
          } else {
            console.log(`Successfully added ${participants.length} participants to team conversation`);
          }
        }
      }
    } catch (error) {
      console.error('Error in createTeamConversationIfNeeded:', error);
    }
  };

  return { createTeamConversationIfNeeded };
};
