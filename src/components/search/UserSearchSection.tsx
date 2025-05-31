
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Search } from 'lucide-react';
import UserSearchResults from './UserSearchResults';

interface UserSearchSectionProps {
  user: any;
}

const UserSearchSection: React.FC<UserSearchSectionProps> = ({ user }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Lock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Connexion requise
            </h3>
            <p className="text-gray-500 mb-6">
              Vous devez être connecté pour accéder à la recherche de joueurs
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/login')} className="bg-airsoft-red hover:bg-red-700">
                Se connecter
              </Button>
              <Button onClick={() => navigate('/register')} variant="outline">
                S'inscrire
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center border rounded-md overflow-hidden mb-6">
          <Input 
            placeholder="Rechercher un joueur par nom, localisation..." 
            className="border-0 focus-visible:ring-0 flex-1" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />
          <Button variant="ghost" className="rounded-l-none">
            <Search className="h-5 w-5" />
          </Button>
        </div>
        
        <UserSearchResults searchQuery={searchQuery} />
      </CardContent>
    </Card>
  );
};

export default UserSearchSection;
