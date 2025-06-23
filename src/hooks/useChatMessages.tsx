
import { useConversationDetails } from './messaging/useConversationDetails';
import { useMessagesData } from './messaging/useMessagesData';
import { useMessageActions } from './messaging/useMessageActions';

export const useChatMessages = (conversationId: string) => {
  const { data: conversation, isLoading: conversationLoading, error: conversationError } = useConversationDetails(conversationId);
  const { data: messages = [], isLoading: messagesLoading, error: messagesError } = useMessagesData(conversationId);
  const { sendMessage, markAsRead } = useMessageActions(conversationId);

  const isLoading = conversationLoading || messagesLoading;
  const error = conversationError || messagesError;

  console.log('[useChatMessages] State:', {
    conversationId,
    conversationLoading,
    messagesLoading,
    isLoading,
    hasError: !!error,
    errorMessage: error?.message
  });

  return {
    messages,
    conversation,
    sendMessage,
    markAsRead,
    isLoading,
    error
  };
};
