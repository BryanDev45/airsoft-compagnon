
import React from 'react';
import { MessageSquare } from 'lucide-react';

const EmptyConversations: React.FC = () => {
  return (
    <div className="text-center py-16">
      <div className="relative mx-auto mb-6">
        <div className="absolute inset-0 bg-gray-100 rounded-full blur-sm"></div>
        <div className="relative w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center border border-gray-200/60 shadow-sm">
          <MessageSquare className="h-10 w-10 text-gray-400" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune conversation</h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        Vos conversations apparaîtront ici
      </p>
    </div>
  );
};

export default EmptyConversations;
