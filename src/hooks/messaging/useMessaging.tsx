
import { useState, useEffect } from 'react';
import { useConversationsQuery } from './useConversationsQuery';
import { Conversation } from '@/types/messaging';

export const useMessaging = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: conversations = [], isLoading, refetch } = useConversationsQuery();

  // Calculer le nombre total de messages non lus
  useEffect(() => {
    const totalUnread = conversations.reduce((sum: number, conv: Conversation) => sum + conv.unread_count, 0);
    setUnreadCount(totalUnread);
  }, [conversations]);

  return {
    conversations,
    unreadCount,
    isLoading,
    refetch
  };
};
