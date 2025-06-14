
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
    <div className="flex flex-col h-full w-full bg-white relative">
      {/* Header fixe qui reste toujours visible */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <ChatHeader conversation={conversation} onBack={onBack} />
      </div>

      {/* Zone de messages avec scroll */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full bg-gradient-to-b from-gray-50/30 to-white">
          <div className="w-full max-w-none px-8 py-8 space-y-8">
            {messages.map(message => (
              <MessageItem key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input fixe en bas */}
      <div className="sticky bottom-0 z-10 bg-white border-t">
        <MessageInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
};

export default ChatView;
