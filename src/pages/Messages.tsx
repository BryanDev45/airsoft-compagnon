import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useMessaging } from '@/hooks/messaging/useMessaging';
import ConversationList from '@/components/messaging/ConversationList';
import ChatView from '@/components/messaging/ChatView';
import { Card } from '@/components/ui/card';
import { MessageSquare, Users, Sparkles } from 'lucide-react';

const Messages: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { conversations, isLoading } = useMessaging();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto h-full">
          {/* Enhanced Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-airsoft-red to-red-600 rounded-xl blur-sm opacity-20"></div>
                <div className="relative p-3 bg-gradient-to-br from-airsoft-red to-red-600 rounded-xl shadow-lg">
                  <MessageSquare className="h-7 w-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-1">Messages</h1>
                <p className="text-gray-600 text-lg">Communiquez avec votre équipe et les autres joueurs</p>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Conversations</p>
                    <p className="text-xl font-semibold text-gray-900">{conversations.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Messages non lus</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {conversations.reduce((sum, conv) => sum + conv.unread_count, 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Statut</p>
                    <p className="text-xl font-semibold text-green-600">En ligne</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Main Content Card avec hauteur fixe */}
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm ring-1 ring-white/20 h-[calc(100vh-360px)] min-h-[600px] flex flex-col">
            <div className="flex h-full">
              {/* Enhanced Sidebar - Conversation List */}
              <div className={`${selectedConversationId ? 'hidden lg:block' : ''} w-full lg:w-96 border-r border-gray-100/80 bg-gradient-to-b from-white/95 to-gray-50/50 backdrop-blur-sm flex flex-col`}>
                <div className="p-6 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/80 via-white/90 to-gray-50/80 backdrop-blur-sm flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="font-semibold text-gray-900 text-lg">Conversations</h2>
                    </div>
                    {conversations.length > 0 && (
                      <span className="bg-gradient-to-r from-airsoft-red to-red-600 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
                        {conversations.length}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="relative">
                          <div className="animate-spin rounded-full h-10 w-10 border-3 border-transparent border-t-airsoft-red mx-auto mb-4"></div>
                          <div className="absolute inset-0 rounded-full border-3 border-gray-200"></div>
                        </div>
                        <p className="text-gray-500 font-medium">Chargement des conversations...</p>
                      </div>
                    </div>
                  ) : (
                    <ConversationList 
                      conversations={conversations}
                      onSelectConversation={setSelectedConversationId}
                    />
                  )}
                </div>
              </div>

              {/* Enhanced Main Chat Area */}
              <div className={`${selectedConversationId ? '' : 'hidden lg:flex'} flex-1 flex items-center justify-center bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20`}>
                {selectedConversationId ? (
                  <div className="h-full w-full">
                    <ChatView 
                      conversationId={selectedConversationId} 
                      onBack={() => setSelectedConversationId(null)}
                    />
                  </div>
                ) : (
                  <div className="text-center p-12 max-w-md">
                    <div className="mb-8">
                      <div className="relative mx-auto mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-airsoft-red/20 to-red-200/40 rounded-full blur-xl"></div>
                        <div className="relative w-32 h-32 bg-gradient-to-br from-airsoft-red/10 via-red-50 to-red-100/80 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/40 shadow-lg">
                          <MessageSquare className="h-16 w-16 text-airsoft-red" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Sélectionnez une conversation
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Choisissez une conversation dans la liste pour commencer à échanger avec votre équipe ou d'autres joueurs.
                      </p>
                    </div>
                    
                    {conversations.length === 0 && !isLoading && (
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100/60 shadow-sm">
                        <div className="flex items-center justify-center gap-2 text-blue-700 mb-3">
                          <div className="p-1.5 bg-blue-100 rounded-lg">
                            <Users className="h-4 w-4" />
                          </div>
                          <span className="font-semibold">Astuce</span>
                        </div>
                        <p className="text-blue-600 text-sm leading-relaxed">
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
