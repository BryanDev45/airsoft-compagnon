
import React, { useState } from 'react';
import { useOptimizedConversations } from '@/hooks/messaging/useOptimizedConversations';
import ConversationList from '@/components/messaging/ConversationList';
import ChatView from '@/components/messaging/ChatView';
import NewConversationDialog from '@/components/messaging/NewConversationDialog';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';

const Messages = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const { data: conversations = [], isLoading, error } = useOptimizedConversations();

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const handleBackToList = () => {
    setSelectedConversationId(null);
  };

  const handleNewConversation = () => {
    setShowNewConversation(true);
  };

  const handleConversationCreated = (conversationId: string) => {
    setShowNewConversation(false);
    setSelectedConversationId(conversationId);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header fixe */}
      <div className="flex-shrink-0 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              {!selectedConversationId && (
                <Button
                  onClick={handleNewConversation}
                  size="sm"
                  className="gap-2"
                >
                  <MessageSquarePlus className="h-4 w-4" />
                  Nouveau
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal avec hauteur contrôlée */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full">
          <div className="flex h-full bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Liste des conversations - visible sur desktop ou quand aucune conversation sélectionnée sur mobile */}
            <div className={`${
              selectedConversationId ? 'hidden lg:flex' : 'flex'
            } lg:w-1/3 xl:w-1/4 border-r bg-gray-50 flex-col h-full`}>
              <ConversationList
                conversations={conversations}
                selectedConversationId={selectedConversationId}
                onSelectConversation={handleSelectConversation}
                isLoading={isLoading}
                error={error}
              />
            </div>

            {/* Vue de chat - prend toute la largeur sur mobile quand une conversation est sélectionnée */}
            <div className={`${
              selectedConversationId ? 'flex' : 'hidden lg:flex'
            } flex-1 flex-col h-full`}>
              {selectedConversationId ? (
                <ChatView
                  conversationId={selectedConversationId}
                  onBack={handleBackToList}
                />
              ) : (
                <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50">
                  <div className="text-center text-gray-500">
                    <MessageSquarePlus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">Sélectionnez une conversation</h3>
                    <p className="text-sm">Choisissez une conversation pour commencer à discuter</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <NewConversationDialog
        open={showNewConversation}
        onClose={() => setShowNewConversation(false)}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  );
};

export default Messages;
