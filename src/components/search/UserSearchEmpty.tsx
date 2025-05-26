
import React from 'react';
import { MapPin } from "lucide-react";

interface UserSearchEmptyProps {
  searchQuery: string;
}

const UserSearchEmpty: React.FC<UserSearchEmptyProps> = ({ searchQuery }) => {
  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {searchQuery ? "Aucun joueur trouvé" : "Rechercher des joueurs"}
        </h3>
        <p className="text-gray-500">
          {searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Entrez votre recherche pour trouver des joueurs'}
        </p>
      </div>
    </div>
  );
};

export default UserSearchEmpty;
