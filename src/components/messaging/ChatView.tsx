import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Users, MoreVertical } from 'lucide-react';
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

  // Marquer comme lu quand on ouvre la conversation ET quand de nouveaux messages arrivent
  useEffect(() => {
    console.log('ChatView: Marking messages as read for conversation:', conversationId);
    markAsRead();
  }, [conversationId, messages.length, markAsRead]);

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-airsoft-red"></div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);
  const isTeamConversation = conversation.type === 'team';

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Enhanced Header */}
      <div className="flex items-center gap-4 p-6 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="lg:hidden hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3 flex-1">
          <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-airsoft-red to-red-600 text-white font-medium">
              {isTeamConversation ? (
                <Users className="h-5 w-5" />
              ) : (
                conversation.name?.charAt(0).toUpperCase() || 'C'
              )}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-900">
                {conversation.name || 'Conversation'}
              </h2>
              {isTeamConversation && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  Équipe
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {isTeamConversation ? 'Discussion d\'équipe' : 'Conversation privée'}
            </p>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messageGroups.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Commencez la conversation
              </h3>
              <p className="text-gray-500">
                Soyez le premier à envoyer un message !
              </p>
            </div>
          ) : (
            messageGroups.map(([dateKey, dateMessages]) => (
              <div key={dateKey}>
                <div className="flex justify-center mb-6">
                  <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-gray-200 text-gray-600">
                    {formatMessageDate(dateKey)}
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  {dateMessages.map((message) => {
                    const isOwnMessage = message.sender_id === user?.id;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isOwnMessage && (
                          <Avatar className="h-8 w-8 mt-1 ring-1 ring-gray-200">
                            {message.sender_avatar ? (
                              <AvatarImage src={message.sender_avatar} />
                            ) : (
                              <AvatarFallback className="bg-gray-200 text-gray-600 text-sm font-medium">
                                {message.sender_name?.charAt(0).toUpperCase() || 'U'}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        )}
                        
                        <div className={`max-w-[70%] ${isOwnMessage ? 'order-first' : ''}`}>
                          {!isOwnMessage && (
                            <p className="text-xs font-medium text-gray-600 mb-1 ml-3">
                              {message.sender_name}
                            </p>
                          )}
                          <div
                            className={`rounded-2xl px-4 py-3 shadow-sm ${
                              isOwnMessage
                                ? 'bg-gradient-to-r from-airsoft-red to-red-600 text-white'
                                : 'bg-gray-100 text-gray-900 border border-gray-200'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>
                          <p className={`text-xs text-gray-400 mt-1 ${isOwnMessage ? 'text-right mr-3' : 'text-left ml-3'}`}>
                            {formatMessageTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Enhanced Message Input */}
      <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-200 bg-white">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Tapez votre message..."
              disabled={isSending}
              className="resize-none border-gray-200 focus:border-airsoft-red focus:ring-airsoft-red rounded-xl px-4 py-3"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
          </div>
          <Button 
            type="submit" 
            size="icon" 
            disabled={!messageInput.trim() || isSending}
            className="bg-gradient-to-r from-airsoft-red to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl h-12 w-12 shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatView;
