
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Send } from 'lucide-react';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useAuth } from '@/hooks/useAuth';

interface ChatViewProps {
  conversationId: string;
  onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ conversationId, onBack }) => {
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const { messages, conversation, sendMessage, markAsRead } = useChatMessages(conversationId);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    markAsRead();
  }, [markAsRead]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(messageInput.trim());
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier";
    } else {
      return date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
    }
  };

  const groupMessagesByDate = (messages: any[]) => {
    const groups: { [key: string]: any[] } = {};
    
    messages.forEach(message => {
      const dateKey = new Date(message.created_at).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return Object.entries(groups).sort(([a], [b]) => 
      new Date(a).getTime() - new Date(b).getTime()
    );
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Chargement...</p>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gradient-to-br from-airsoft-red to-red-600 text-white text-sm">
            {conversation.name?.charAt(0).toUpperCase() || 'C'}
          </AvatarFallback>
        </Avatar>
        <h2 className="font-semibold">{conversation.name || 'Conversation'}</h2>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messageGroups.map(([dateKey, dateMessages]) => (
            <div key={dateKey}>
              <div className="flex justify-center mb-4">
                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {formatMessageDate(dateKey)}
                </span>
              </div>
              
              {dateMessages.map((message) => {
                const isOwnMessage = message.sender_id === user?.id;
                
                return (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isOwnMessage && (
                      <Avatar className="h-8 w-8 mt-1">
                        {message.sender_avatar ? (
                          <AvatarImage src={message.sender_avatar} />
                        ) : (
                          <AvatarFallback className="bg-gray-300 text-gray-600 text-sm">
                            {message.sender_name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    )}
                    
                    <div className={`max-w-[70%] ${isOwnMessage ? 'order-first' : ''}`}>
                      {!isOwnMessage && (
                        <p className="text-xs text-gray-500 mb-1 ml-1">
                          {message.sender_name}
                        </p>
                      )}
                      <div
                        className={`rounded-lg px-3 py-2 ${
                          isOwnMessage
                            ? 'bg-airsoft-red text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        {formatMessageTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Tapez votre message..."
            disabled={isSending}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!messageInput.trim() || isSending}
            className="bg-airsoft-red hover:bg-red-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatView;
