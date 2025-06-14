
import { useConversationDetails } from './messaging/useConversationDetails';
import { useMessagesData } from './messaging/useMessagesData';
import { useMessageActions } from './messaging/useMessageActions';

export const useChatMessages = (conversationId: string) => {
  const { data: conversation } = useConversationDetails(conversationId);
  const { data: messages = [] } = useMessagesData(conversationId);
  const { sendMessage, markAsRead } = useMessageActions(conversationId);

  return {
    messages,
    conversation,
    sendMessage,
    markAsRead
  };
};
