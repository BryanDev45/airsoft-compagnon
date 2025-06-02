
import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useMessaging } from '@/hooks/useMessaging';
import ConversationList from './ConversationList';
import ChatView from './ChatView';

const MessagingIcon: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { conversations, unreadCount } = useMessaging();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 border-b">
            <SheetTitle>Messages</SheetTitle>
          </SheetHeader>
          <div className="flex-1 flex">
            {selectedConversationId ? (
              <ChatView 
                conversationId={selectedConversationId} 
                onBack={() => setSelectedConversationId(null)}
              />
            ) : (
              <ConversationList 
                conversations={conversations}
                onSelectConversation={setSelectedConversationId}
              />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MessagingIcon;
