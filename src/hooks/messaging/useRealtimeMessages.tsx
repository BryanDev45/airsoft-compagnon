import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useRealtimeMessages = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up real-time subscriptions for user:', user.id);

    const handleMessageChange = (payload: any) => {
      console.log('Real-time message change:', payload);
      // Invalider les conversations pour mettre à jour le dernier message et le compteur de non-lus
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications', user.id] });

      // Invalider aussi les messages de la conversation spécifique
      const record = (payload.new || payload.old) as { conversation_id?: string };
      if (record?.conversation_id) {
        queryClient.invalidateQueries({ queryKey: ['messages', record.conversation_id] });
      }
    };
    
    const handleConversationChange = (payload: any) => {
      console.log('Real-time conversation change:', payload);
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    // Un seul canal pour tous les changements de la base de données
    const channel = supabase.channel('realtime:all');

    channel
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, handleMessageChange)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, handleConversationChange)
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Real-time subscribed!');
        } else {
          console.log('Real-time subscription status:', status);
        }
      });

    return () => {
      console.log('Cleaning up real-time subscriptions');
      supabase.removeChannel(channel).catch(err => console.error('Error removing channel', err));
    };
  }, [user?.id, queryClient]);
};
