
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
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-airsoft-red to-red-600 rounded-xl shadow-lg">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                    <p className="text-sm text-gray-600 mt-1">
                      {conversations.length > 0 
                        ? `${conversations.length} conversation${conversations.length > 1 ? 's' : ''}`
                        : 'Aucune conversation'
                      }
                    </p>
                  </div>
                </div>
                
                {!selectedConversationId && (
                  <Button
                    onClick={handleNewConversation}
                    className="bg-gradient-to-r from-airsoft-red to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-6 py-3 gap-2 font-medium"
                  >
                    <MessageSquarePlus className="h-5 w-5" />
                    Nouvelle conversation
                  </Button>
                )}
              </div>
              
              {/* Statistiques rapides */}
              <div className="hidden md:flex items-center gap-6">
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
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden" style={{ height: 'calc(100vh - 280px)' }}>
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
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center max-w-md mx-auto p-8">
                        <div className="relative mb-8">
                          <div className="absolute inset-0 bg-gradient-to-r from-airsoft-red/20 to-red-600/20 rounded-full blur-xl"></div>
                          <div className="relative p-6 bg-gradient-to-br from-airsoft-red to-red-600 rounded-full shadow-2xl">
                            <MessageSquarePlus className="h-16 w-16 text-white" />
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          Commencez une conversation
                        </h3>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                          Sélectionnez une conversation existante ou créez-en une nouvelle pour commencer à échanger avec votre équipe ou d'autres joueurs.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button
                            onClick={handleNewConversation}
                            className="bg-gradient-to-r from-airsoft-red to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-8 py-3 gap-3 font-medium"
                          >
                            <MessageSquarePlus className="h-5 w-5" />
                            Nouvelle conversation
                          </Button>
                          
                          <Button
                            variant="outline"
                            className="border-gray-300 hover:bg-gray-50 rounded-xl px-8 py-3 gap-3 font-medium transition-all duration-200"
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
