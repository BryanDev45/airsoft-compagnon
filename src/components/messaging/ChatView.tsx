
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatMessages } from '@/hooks/useChatMessages';
import ChatHeader from './ChatHeader';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';

interface ChatViewProps {
  conversationId: string;
  onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ conversationId, onBack }) => {
  const { messages, conversation, sendMessage, markAsRead } = useChatMessages(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (conversationId) {
      console.log('Marking messages as read for conversation:', conversationId);
      markAsRead();
    }
  }, [conversationId, markAsRead]);

  // Marquer les messages comme lus quand de nouveaux messages arrivent
  useEffect(() => {
    if (messages.length > 0) {
      const timeoutId = setTimeout(() => {
        markAsRead();
      }, 1000); // Attendre 1 seconde avant de marquer comme lu

      return () => clearTimeout(timeoutId);
    }
  }, [messages.length, markAsRead]);

  return (
    <div className="h-full w-full bg-white flex flex-col">
      {/* Header - reste en haut */}
      <div className="flex-shrink-0 border-b shadow-sm">
        <ChatHeader conversation={conversation} onBack={onBack} />
      </div>

      {/* Zone de messages - prend tout l'espace disponible entre header et input */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full bg-gradient-to-b from-gray-50/30 to-white">
          <div className="px-8 py-8 space-y-8">
            {messages.map(message => (
              <MessageItem key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </ScrollArea>
      </div>

      {/* Input - reste en bas */}
      <div className="flex-shrink-0 border-t">
        <MessageInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default ChatView;
