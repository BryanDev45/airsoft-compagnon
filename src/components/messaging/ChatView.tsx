
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, MoreVertical, Phone, Video } from 'lucide-react';
import { useChatMessages } from '@/hooks/useChatMessages';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatViewProps {
  conversationId: string;
  onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ conversationId, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const { messages, conversation, sendMessage, markAsRead } = useChatMessages(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-white via-gray-50/50 to-white backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="lg:hidden hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-airsoft-red to-red-600 text-white font-semibold">
              {getConversationTitle().charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="font-semibold text-gray-900 text-lg">{getConversationTitle()}</h2>
            <p className="text-sm text-green-600 font-medium">En ligne</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full">
            <Phone className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full">
            <Video className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Enhanced Messages */}
      <ScrollArea className="flex-1 bg-gradient-to-b from-gray-50/30 to-white">
        <div className="p-6 space-y-6">
          {messages.map((message) => {
            const isOwnMessage = message.sender_id === conversation?.id;
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                {!isOwnMessage && (
                  <Avatar className="h-8 w-8 ring-1 ring-gray-200 shadow-sm">
                    <AvatarImage src={message.sender_avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 text-sm font-medium">
                      {message.sender_name[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[70%] ${isOwnMessage ? 'order-first' : ''}`}>
                  <div className={`relative rounded-2xl px-4 py-3 shadow-sm ${
                    isOwnMessage
                      ? 'bg-gradient-to-r from-airsoft-red to-red-600 text-white ml-auto'
                      : 'bg-white text-gray-900 border border-gray-100'
                  }`}>
                    {/* Message bubble tail */}
                    <div className={`absolute top-3 w-3 h-3 transform rotate-45 ${
                      isOwnMessage 
                        ? 'bg-gradient-to-br from-airsoft-red to-red-600 -right-1' 
                        : 'bg-white border-r border-b border-gray-100 -left-1'
                    }`}></div>
                    
                    <p className="text-sm leading-relaxed relative z-10">{message.content}</p>
                  </div>
                  
                  <div className={`text-xs text-gray-500 mt-2 flex items-center gap-2 ${
                    isOwnMessage ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className="font-medium">{message.sender_name}</span>
                    <span>•</span>
                    <span>{formatTime(message.created_at)}</span>
                    {isOwnMessage && (
                      <span className="text-green-600 font-medium">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Enhanced Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-gradient-to-r from-white via-gray-50/30 to-white backdrop-blur-sm">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tapez votre message..."
              className="pr-12 py-3 rounded-2xl border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-airsoft-red/20 focus:border-airsoft-red transition-all duration-200"
            />
          </div>
          <Button 
            type="submit" 
            size="icon" 
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-airsoft-red to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-12 w-12"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatView;
