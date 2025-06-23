
import React, { useRef, useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
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
  const { messages, conversation, sendMessage, markAsRead, isLoading, error } = useChatMessages(conversationId);
  const { typingUsers, trackTyping } = useTypingStatus(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  console.log('[ChatView] Rendering with:', {
    conversationId,
    hasConversation: !!conversation,
    messagesCount: messages?.length || 0,
    isLoading,
    error: error?.message
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages && messages.length > 0 && !hasInitialized) {
      setTimeout(scrollToBottom, 100);
      setHasInitialized(true);
    } else if (messages && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, hasInitialized]);

  useEffect(() => {
    if (conversation && !isLoading) {
      const timeoutId = setTimeout(() => {
        markAsRead();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [conversation, isLoading, markAsRead]);

  const getTypingText = () => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) return `${typingUsers[0]} est en train d'écrire...`;
    if (typingUsers.length === 2) return `${typingUsers[0]} et ${typingUsers[1]} sont en train d'écrire...`;
    return `Plusieurs personnes sont en train d'écrire...`;
  };
  const typingText = getTypingText();

  // Error state
  if (error) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 p-4 border-b bg-white flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="lg:hidden">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-semibold text-red-600">Erreur de chargement</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="p-3 bg-red-100 rounded-full w-fit mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Impossible de charger la conversation</h3>
            <p className="text-gray-600 text-sm mb-4">
              {error.message || 'Une erreur est survenue lors du chargement.'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={onBack} variant="outline" size="sm">
                Retour
              </Button>
              <Button onClick={() => window.location.reload()} variant="default" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Actualiser
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading || !conversation) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 p-4 border-b bg-white flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="lg:hidden">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-airsoft-red border-t-transparent"></div>
            <span className="text-gray-600">Chargement...</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-transparent border-t-airsoft-red mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement de la conversation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
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
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="px-4 sm:px-8 py-8 space-y-8">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[300px]">
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
            <div ref={messagesEndRef} className="h-1" />
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
