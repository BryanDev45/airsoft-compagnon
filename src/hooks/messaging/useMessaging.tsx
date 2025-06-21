
import { useOptimizedConversations } from './useOptimizedConversations';
import { useNetworkRequest } from '../useNetworkRequest';

export const useMessaging = () => {
  const { 
    data: conversations = [], 
    isLoading, 
    error, 
    refetch 
  } = useOptimizedConversations();

  const { executeRequest } = useNetworkRequest({
    maxRetries: 2,
    initialDelay: 1000,
  });

  const refreshConversations = async () => {
    try {
      await executeRequest(
        () => refetch(),
        {
          silent: true
        }
      );
    } catch (error) {
      console.error('Error refreshing conversations:', error);
    }
  };

  return {
    conversations,
    isLoading,
    error,
    refreshConversations
  };
};
