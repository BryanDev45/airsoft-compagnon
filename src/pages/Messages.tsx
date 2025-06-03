
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useMessaging } from '@/hooks/useMessaging';
import ConversationList from '@/components/messaging/ConversationList';
import ChatView from '@/components/messaging/ChatView';

const Messages: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { conversations, isLoading } = useMessaging();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '70vh' }}>
            <div className="flex h-full">
              {/* Liste des conversations */}
              <div className={`${selectedConversationId ? 'hidden md:block' : ''} w-full md:w-1/3 border-r border-gray-200`}>
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Chargement...</p>
                  </div>
                ) : (
                  <ConversationList 
                    conversations={conversations}
                    onSelectConversation={setSelectedConversationId}
                  />
                )}
              </div>

              {/* Zone de chat */}
              <div className={`${selectedConversationId ? '' : 'hidden md:flex'} flex-1 flex items-center justify-center`}>
                {selectedConversationId ? (
                  <ChatView 
                    conversationId={selectedConversationId} 
                    onBack={() => setSelectedConversationId(null)}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <p className="text-lg">Sélectionnez une conversation pour commencer</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Messages;
