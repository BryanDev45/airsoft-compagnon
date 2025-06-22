
import { useOptimizedConversations } from './useOptimizedConversations';

export const useMessaging = () => {
  const { data: conversations = [], isLoading, error, refetch } = useOptimizedConversations();

  console.log('useMessaging result:', { 
    conversationsCount: conversations.length, 
    isLoading, 
    error: error?.message,
    hasData: !!conversations
  });

  return {
    conversations,
    isLoading,
    error,
    refetch
  };
};
