
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

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Header fixe */}
      <div className="flex-shrink-0 bg-white border-b shadow-sm z-20 relative">
        <ChatHeader conversation={conversation} onBack={onBack} />
      </div>

      {/* Zone de messages avec scroll - prend tout l'espace disponible */}
      <div className="flex-1 min-h-0 relative">
        <ScrollArea className="h-full bg-gradient-to-b from-gray-50/30 to-white">
          <div className="w-full max-w-none px-8 py-8 space-y-8 min-h-full">
            {messages.map(message => (
              <MessageItem key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </ScrollArea>
      </div>

      {/* Input fixe en bas */}
      <div className="flex-shrink-0 bg-white border-t z-20 relative">
        <MessageInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default ChatView;
