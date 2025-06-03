
import React, { useState, useEffect } from 'react';
import { useMessaging } from '@/hooks/useMessaging';
import { useAuth } from '@/hooks/auth/useAuth';
import { supabase } from '@/integrations/supabase/client';
import ConversationList from '@/components/messaging/ConversationList';
import ChatView from '@/components/messaging/ChatView';

const Messages = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { conversations, isLoading } = useMessaging();
  const { user } = useAuth();

  // Créer automatiquement une conversation d'équipe si nécessaire
  useEffect(() => {
    const createTeamConversation = async () => {
      if (!user?.team_id) return;

      // Vérifier si une conversation d'équipe existe déjà
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('type', 'team')
        .eq('team_id', user.team_id)
        .single();

      if (!existingConversation) {
        // Créer une conversation d'équipe
        const { data: teamData } = await supabase
          .from('teams')
          .select('name')
          .eq('id', user.team_id)
          .single();

        if (teamData) {
          const { data: newConversation } = await supabase
            .from('conversations')
            .insert({
              type: 'team',
              team_id: user.team_id,
              name: `Équipe ${teamData.name}`
            })
            .select('id')
            .single();

          if (newConversation) {
            // Ajouter tous les membres de l'équipe à la conversation
            const { data: teamMembers } = await supabase
              .from('team_members')
              .select('user_id')
              .eq('team_id', user.team_id)
              .eq('status', 'confirmed');

            if (teamMembers) {
              const participants = teamMembers.map(member => ({
                conversation_id: newConversation.id,
                user_id: member.user_id
              }));

              await supabase
                .from('conversation_participants')
                .insert(participants);
            }
          }
        }
      }
    };

    createTeamConversation();
  }, [user?.team_id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-airsoft-red"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-200px)] flex">
        <div className="w-1/3 border-r">
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold">Messages</h1>
          </div>
          <ConversationList 
            conversations={conversations}
            onSelectConversation={setSelectedConversationId}
          />
        </div>
        
        <div className="flex-1">
          {selectedConversationId ? (
            <ChatView 
              conversationId={selectedConversationId} 
              onBack={() => setSelectedConversationId(null)}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-xl">Sélectionnez une conversation pour commencer</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
