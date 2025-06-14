import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, MoreVertical, Users } from 'lucide-react';
import { useChatMessages } from '@/hooks/useChatMessages';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/hooks/useAuth';

interface ChatViewProps {
  conversationId: string;
  onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({
  conversationId,
  onBack
}) => {
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const {
    messages,
    conversation,
    sendMessage,
    markAsRead
  } = useChatMessages(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Marquer les messages comme lus automatiquement quand la conversation est ouverte
  useEffect(() => {
    if (conversationId) {
      console.log('Marking messages as read for conversation:', conversationId);
      markAsRead();
    }
  }, [conversationId, markAsRead]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await sendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConversationTitle = () => {
    if (conversation?.type === 'team' && conversation.name) {
      return conversation.name;
    }
    return 'Conversation';
  };

  const getConversationAvatar = () => {
    if (conversation?.type === 'team') {
      return null; // Pas d'image pour les équipes, on utilisera l'icône
    }
    // Pour les conversations directes, trouver l'autre participant
    const otherParticipant = conversation?.participants?.find(p => p.id !== user?.id);
    return otherParticipant?.avatar;
  };

  const getConversationAvatarFallback = () => {
    if (conversation?.type === 'team') {
      return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-lg w-full h-full flex items-center justify-center">
          <Users className="h-7 w-7" />
        </div>
      );
    }
    // Pour les conversations directes
    const otherParticipant = conversation?.participants?.find(p => p.id !== user?.id);
    const displayName = otherParticipant?.username || 'Utilisateur';
    return (
      <div className="bg-gradient-to-br from-airsoft-red to-red-600 text-white font-semibold text-lg w-full h-full flex items-center justify-center">
        {displayName.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Enhanced Header - Full Width */}
      <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-white via-gray-50/50 to-white backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="lg:hidden hover:bg-gray-100 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-12 w-12 ring-2 ring-white shadow-lg">
            <AvatarImage src={getConversationAvatar()} />
            <AvatarFallback className="bg-gradient-to-br from-airsoft-red to-red-600 text-white font-semibold text-lg">
              {getConversationAvatarFallback()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="font-bold text-gray-900 text-xl">{getConversationTitle()}</h2>
            <p className="text-sm text-green-600 font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              En ligne
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full h-12 w-12">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Enhanced Messages - Full Width Container */}
      <ScrollArea className="flex-1 bg-gradient-to-b from-gray-50/30 to-white">
        <div className="w-full max-w-none px-8 py-8 space-y-8">
          {messages.map(message => {
            // Corriger la logique : comparer avec l'ID de l'utilisateur connecté
            const isOwnMessage = message.sender_id === user?.id;
            return (
              <div key={message.id} className={`flex gap-4 w-full ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                {!isOwnMessage && (
                  <Avatar className="h-10 w-10 ring-2 ring-gray-200 shadow-sm flex-shrink-0">
                    <AvatarImage src={message.sender_avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 text-sm font-medium">
                      {message.sender_name[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`flex flex-col max-w-[75%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                  <div className={`relative rounded-3xl px-6 py-4 shadow-lg transition-all duration-200 hover:shadow-xl ${isOwnMessage ? 'bg-gradient-to-r from-airsoft-red to-red-600 text-white' : 'bg-white text-gray-900 border border-gray-100'}`}>
                    {/* Message bubble tail */}
                    <div className={`absolute top-4 w-4 h-4 transform rotate-45 ${isOwnMessage ? 'bg-gradient-to-br from-airsoft-red to-red-600 -right-2' : 'bg-white border-r border-b border-gray-100 -left-2'}`}></div>
                    
                    <p className="text-base leading-relaxed relative z-10 break-words">{message.content}</p>
                  </div>
                  
                  <div className={`text-xs text-gray-500 mt-3 flex items-center gap-2 px-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="font-semibold">{message.sender_name}</span>
                    <span>•</span>
                    <span>{formatTime(message.created_at)}</span>
                    {isOwnMessage && <span className="text-green-600 font-bold text-sm">✓✓</span>}
                  </div>
                </div>
                
                {isOwnMessage && (
                  <Avatar className="h-10 w-10 ring-2 ring-red-200 shadow-sm flex-shrink-0">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-airsoft-red to-red-600 text-white font-medium text-sm">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Enhanced Message Input - Full Width */}
      <form onSubmit={handleSendMessage} className="p-6 border-t bg-gradient-to-r from-white via-gray-50/30 to-white backdrop-blur-sm">
        <div className="flex gap-4 items-end w-full max-w-none">
          <div className="flex-1 relative">
            <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Tapez votre message..." className="w-full pr-4 py-4 text-base rounded-3xl border-gray-200 bg-white/90 backdrop-blur-sm shadow-md focus:ring-2 focus:ring-airsoft-red/20 focus:border-airsoft-red transition-all duration-200 resize-none" style={{
            minHeight: '56px'
          }} />
          </div>
          <Button type="submit" size="icon" disabled={!newMessage.trim()} className="bg-gradient-to-r from-airsoft-red to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed h-14 w-14 flex-shrink-0">
            <Send className="h-6 w-6" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatView;
