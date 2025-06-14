
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send } from 'lucide-react';
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white/50 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="lg:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="font-semibold text-gray-900">{getConversationTitle()}</h2>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender_id === conversation?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender_id !== conversation?.id && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.sender_avatar} />
                  <AvatarFallback>{message.sender_name[0]}</AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[70%] ${
                message.sender_id === conversation?.id ? 'order-first' : ''
              }`}>
                <div className={`rounded-lg px-3 py-2 ${
                  message.sender_id === conversation?.id
                    ? 'bg-airsoft-red text-white ml-auto'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${
                  message.sender_id === conversation?.id ? 'text-right' : 'text-left'
                }`}>
                  {message.sender_name} • {formatTime(message.created_at)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-white/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tapez votre message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatView;
