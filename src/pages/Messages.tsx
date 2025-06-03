
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useMessaging } from '@/hooks/useMessaging';
import ConversationList from '@/components/messaging/ConversationList';
import ChatView from '@/components/messaging/ChatView';
import { Card } from '@/components/ui/card';
import { MessageSquare, Users } from 'lucide-react';

const Messages: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { conversations, isLoading } = useMessaging();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-airsoft-red rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            </div>
            <p className="text-gray-600">Communiquez avec votre équipe et les autres joueurs</p>
          </div>
          
          {/* Main Content Card */}
          <Card className="overflow-hidden shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="flex h-[calc(100vh-280px)] min-h-[600px]">
              {/* Sidebar - Conversation List */}
              <div className={`${selectedConversationId ? 'hidden lg:block' : ''} w-full lg:w-96 border-r border-gray-200 bg-white/50`}>
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-airsoft-red" />
                    <h2 className="font-semibold text-gray-900">Conversations</h2>
                    {conversations.length > 0 && (
                      <span className="ml-auto bg-airsoft-red text-white text-xs px-2 py-1 rounded-full">
                        {conversations.length}
                      </span>
                    )}
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-airsoft-red mx-auto mb-4"></div>
                      <p className="text-gray-500">Chargement des conversations...</p>
                    </div>
                  </div>
                ) : (
                  <ConversationList 
                    conversations={conversations}
                    onSelectConversation={setSelectedConversationId}
                  />
                )}
              </div>

              {/* Main Chat Area */}
              <div className={`${selectedConversationId ? '' : 'hidden lg:flex'} flex-1 flex items-center justify-center bg-gradient-to-br from-white to-gray-50`}>
                {selectedConversationId ? (
                  <ChatView 
                    conversationId={selectedConversationId} 
                    onBack={() => setSelectedConversationId(null)}
                  />
                ) : (
                  <div className="text-center p-8">
                    <div className="mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-airsoft-red/10 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-12 w-12 text-airsoft-red" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Sélectionnez une conversation
                      </h3>
                      <p className="text-gray-500 max-w-md">
                        Choisissez une conversation dans la liste pour commencer à échanger avec votre équipe ou d'autres joueurs.
                      </p>
                    </div>
                    
                    {conversations.length === 0 && !isLoading && (
                      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 text-blue-700 mb-2">
                          <Users className="h-5 w-5" />
                          <span className="font-medium">Astuce</span>
                        </div>
                        <p className="text-blue-600 text-sm">
                          Rejoignez une équipe pour commencer à discuter avec vos coéquipiers !
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Messages;
