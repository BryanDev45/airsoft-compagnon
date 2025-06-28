
import React, { useState } from 'react';
import { useOptimizedConversations } from '@/hooks/messaging/useOptimizedConversations';
import ConversationList from '@/components/messaging/ConversationList';
import ChatView from '@/components/messaging/ChatView';
import NewConversationDialog from '@/components/messaging/NewConversationDialog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, Users, MessageCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      <Header />
      
      <div className="flex-1">
        {/* Header de la page amélioré */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-airsoft-red to-red-600 rounded-xl shadow-lg flex-shrink-0">
                    <MessageCircle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">Messages</h1>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
                      {conversations.length > 0 
                        ? `${conversations.length} conversation${conversations.length > 1 ? 's' : ''}`
                        : 'Aucune conversation'
                      }
                    </p>
                  </div>
                </div>
                
                {/* Bouton pour mobile et desktop */}
                {!selectedConversationId && (
                  <Button
                    onClick={handleNewConversation}
                    className="bg-gradient-to-r from-airsoft-red to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl font-medium flex-shrink-0
                    px-3 py-2 gap-2 text-sm sm:px-6 sm:py-3 sm:gap-2 sm:text-base"
                  >
                    <MessageSquarePlus className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden xs:inline sm:inline">Nouvelle conversation</span>
                    <span className="xs:hidden sm:hidden">Nouveau</span>
                  </Button>
                )}
              </div>
              
              {/* Statistiques rapides - cachées sur mobile */}
              <div className="hidden lg:flex items-center gap-6 ml-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{conversations.length}</div>
                  <div className="text-xs text-gray-500">Conversations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {conversations.filter(c => c.unread_count > 0).length}
                  </div>
                  <div className="text-xs text-gray-500">Non lues</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal avec design amélioré */}
        <div className="py-4 sm:py-8">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
              <div className="flex h-full">
                {/* Liste des conversations avec design amélioré */}
                <div className={`${
                  selectedConversationId ? 'hidden lg:flex' : 'flex'
                } lg:w-1/3 xl:w-1/4 border-r border-gray-200/50 bg-gradient-to-b from-gray-50/50 to-white/80 backdrop-blur-sm flex-col h-full`}>
                  <ConversationList
                    conversations={conversations}
                    selectedConversationId={selectedConversationId}
                    onSelectConversation={handleSelectConversation}
                    isLoading={isLoading}
                    error={error}
                  />
                </div>

                {/* Vue de chat avec design amélioré */}
                <div className={`${
                  selectedConversationId ? 'flex' : 'hidden lg:flex'
                } flex-1 flex-col h-full bg-gradient-to-b from-white to-gray-50/30`}>
                  {selectedConversationId ? (
                    <ChatView
                      conversationId={selectedConversationId}
                      onBack={handleBackToList}
                    />
                  ) : (
                    <div className="flex-1 flex items-center justify-center p-4">
                      <div className="text-center max-w-md mx-auto">
                        <div className="relative mb-6 sm:mb-8">
                          <div className="absolute inset-0 bg-gradient-to-r from-airsoft-red/20 to-red-600/20 rounded-full blur-xl"></div>
                          <div className="relative p-4 sm:p-6 bg-gradient-to-br from-airsoft-red to-red-600 rounded-full shadow-2xl">
                            <MessageSquarePlus className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
                          </div>
                        </div>
                        
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                          Commencez une conversation
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                          Sélectionnez une conversation existante ou créez-en une nouvelle pour commencer à échanger avec votre équipe ou d'autres joueurs.
                        </p>
                        
                        <div className="flex flex-col gap-3 sm:gap-4 justify-center">
                          <Button
                            onClick={handleNewConversation}
                            className="bg-gradient-to-r from-airsoft-red to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-6 sm:px-8 py-3 gap-3 font-medium w-full sm:w-auto"
                          >
                            <MessageSquarePlus className="h-5 w-5" />
                            Nouvelle conversation
                          </Button>
                          
                          <Button
                            variant="outline"
                            className="border-gray-300 hover:bg-gray-50 rounded-xl px-6 sm:px-8 py-3 gap-3 font-medium transition-all duration-200 w-full sm:w-auto"
                          >
                            <Users className="h-5 w-5" />
                            Voir les équipes
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <NewConversationDialog
        open={showNewConversation}
        onClose={() => setShowNewConversation(false)}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  );
};

export default Messages;
