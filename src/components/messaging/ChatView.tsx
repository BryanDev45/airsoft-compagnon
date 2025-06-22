
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatMessages } from '@/hooks/useChatMessages';
import ChatHeader from './ChatHeader';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import { useTypingStatus } from '@/hooks/messaging/useTypingStatus';

interface ChatViewProps {
  conversationId: string;
  onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ conversationId, onBack }) => {
  const { messages, conversation, sendMessage, markAsRead } = useChatMessages(conversationId);
  const { typingUsers, trackTyping } = useTypingStatus(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (conversationId) {
      markAsRead();
    }
  }, [conversationId, markAsRead]);

  useEffect(() => {
    if (messages.length > 0) {
      const timeoutId = setTimeout(() => {
        markAsRead();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [messages.length, markAsRead]);

  const getTypingText = () => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) return `${typingUsers[0]} est en train d'écrire...`;
    if (typingUsers.length === 2) return `${typingUsers[0]} et ${typingUsers[1]} sont en train d'écrire...`;
    return `Plusieurs personnes sont en train d'écrire...`;
  };
  const typingText = getTypingText();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header fixe */}
      <div className="flex-shrink-0 border-b shadow-sm bg-white z-10">
        <ChatHeader conversation={conversation} onBack={onBack} />
      </div>

      {/* Indicateur de frappe */}
      {typingText && (
        <div className="flex-shrink-0 px-4 sm:px-8 py-2 text-sm text-gray-500 animate-pulse bg-gray-50/80 border-b">
          {typingText}
        </div>
      )}

      {/* Zone de messages scrollable */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="px-4 sm:px-8 py-8 space-y-8 min-h-full">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <p>Aucun message pour le moment</p>
                  <p className="text-sm">Commencez la conversation !</p>
                </div>
              </div>
            ) : (
              messages.map(message => (
                <MessageItem key={message.id} message={message} />
              ))
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </ScrollArea>
      </div>

      {/* Zone de saisie fixe */}
      <div className="flex-shrink-0 border-t bg-white">
        <MessageInput onSendMessage={sendMessage} onTyping={trackTyping} />
      </div>
    </div>
  );
};

export default ChatView;
