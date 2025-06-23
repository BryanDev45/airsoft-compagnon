
import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useOptimizedConversations } from '@/hooks/messaging/useOptimizedConversations';
import { useNavigate } from 'react-router-dom';
import ConversationList from './ConversationList';
import ChatView from './ChatView';
import NewConversationDialog from './NewConversationDialog';

const MessagingIcon: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { data: conversations = [], isLoading, error } = useOptimizedConversations();
  const navigate = useNavigate();

  // Calculate unread count from conversations
  const unreadCount = conversations.reduce((total, conv) => total + (conv.unread_count || 0), 0);

  const handleViewAllMessages = () => {
    setIsOpen(false);
    navigate('/messages');
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedConversationId(null);
    }
  };

  const handleNewConversationCreated = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:text-airsoft-red">
          <MessageSquare size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-airsoft-red text-white text-xs flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[400px] md:w-[540px] p-0 flex flex-col">
        {selectedConversationId ? (
          <ChatView 
            conversationId={selectedConversationId} 
            onBack={() => setSelectedConversationId(null)}
          />
        ) : (
          <>
            <SheetHeader className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <SheetTitle>Messages</SheetTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleViewAllMessages}
                  className="text-sm"
                >
                  Voir tout
                </Button>
              </div>
              <NewConversationDialog onConversationSelected={handleNewConversationCreated} />
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
              <ConversationList 
                conversations={conversations}
                selectedConversationId={selectedConversationId}
                onSelectConversation={setSelectedConversationId}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MessagingIcon;
