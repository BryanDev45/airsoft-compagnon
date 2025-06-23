
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Plus, Search, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useFriendsList } from '@/hooks/messaging/useFriendsList';
import { useDirectConversationCreation } from '@/hooks/messaging/useDirectConversationCreation';

interface NewConversationDialogProps {
  onConversationSelected?: (conversationId: string) => void;
  onConversationCreated?: (conversationId: string) => void;
  open?: boolean;
  onClose?: () => void;
}

const NewConversationDialog: React.FC<NewConversationDialogProps> = ({
  onConversationSelected,
  onConversationCreated,
  open,
  onClose
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { friends, isLoading } = useFriendsList();
  const { createDirectConversation, isCreating } = useDirectConversationCreation();

  // Use external open state if provided, otherwise use internal state
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = open !== undefined ? (value: boolean) => {
    if (!value && onClose) onClose();
  } : setInternalOpen;

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectFriend = async (friend: any) => {
    try {
      const conversationId = await createDirectConversation(friend.id, friend.username);
      if (conversationId) {
        if (onConversationSelected) {
          onConversationSelected(conversationId);
        }
        if (onConversationCreated) {
          onConversationCreated(conversationId);
        }
      }
      setIsOpen(false);
      setSearchTerm('');
    } catch (error) {
      console.error('Erreur lors de la création/ouverture de la conversation:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {open === undefined && (
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvelle conversation
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Nouvelle conversation
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un ami..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-64">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-airsoft-red border-t-transparent"></div>
              </div>
            ) : filteredFriends.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'Aucun ami trouvé' : 'Aucun ami dans votre liste'}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFriends.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => handleSelectFriend(friend)}
                    disabled={isCreating}
                    className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={friend.avatar || undefined} />
                      <AvatarFallback>
                        {friend.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{friend.username}</p>
                      {friend.location && (
                        <p className="text-sm text-gray-500">{friend.location}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationDialog;
