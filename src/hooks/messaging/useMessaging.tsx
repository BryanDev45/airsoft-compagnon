
import { useOptimizedConversations } from './useOptimizedConversations';

export const useMessaging = () => {
  const { data: conversations = [], isLoading, error } = useOptimizedConversations();

  console.log('useMessaging result:', { 
    conversationsCount: conversations.length, 
    isLoading, 
    error: error?.message 
  });

  return {
    conversations,
    isLoading,
    error
  };
};
