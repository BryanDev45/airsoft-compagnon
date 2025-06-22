
import { useOptimizedConversations } from './useOptimizedConversations';

export const useMessaging = () => {
  const { data: conversations = [], isLoading, error } = useOptimizedConversations();

  return {
    conversations,
    isLoading,
    error
  };
};
