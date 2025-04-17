
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Shield, MessageCircle, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Mock data for user search results
const mockUsers = [
  {
    id: 1,
    username: "AirsoftMaster",
    avatar: "/placeholder.svg",
    location: "Paris, France",
    team: "Les Rapaces",
    teamId: "1",
    bio: "Joueur d'airsoft depuis 5 ans, spécialiste en CQB",
    verified: true
  },
  {
    id: 2,
    username: "SniperElite",
    avatar: "/placeholder.svg",
    location: "Lyon, France",
    team: "Ghost Team",
    teamId: "2",
    bio: "Sniper et tireur de précision, amateur de parties MilSim",
    verified: false
  },
  {
    id: 3,
    username: "TacticCool",
    avatar: "/placeholder.svg",
    location: "Marseille, France",
    team: "Strike Force",
    teamId: "3",
    bio: "Équipement tactique et stratégies militaires",
    verified: true
  }
];

interface UserSearchResultsProps {
  searchQuery: string;
}

const UserSearchResults = ({ searchQuery }: UserSearchResultsProps) => {
  const navigate = useNavigate();
  
  // Filter users based on search query
  const filteredUsers = mockUsers.filter(user => 
    searchQuery.length === 0 || 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleNavigateToProfile = (username: string) => {
    navigate(`/user/${username}`);
  };
  
  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun joueur trouvé</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {filteredUsers.map(user => (
        <div key={user.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div 
              className="flex-shrink-0 cursor-pointer" 
              onClick={() => handleNavigateToProfile(user.username)}
            >
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span 
                  className="font-semibold hover:text-airsoft-red transition-colors cursor-pointer"
                  onClick={() => handleNavigateToProfile(user.username)}
                >
                  {user.username}
                </span>
                {user.verified && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Vérifié
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{user.bio}</p>
              
              <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-1">
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    {user.location}
                  </div>
                )}
                
                {user.team && (
                  <div className="flex items-center gap-1">
                    <Shield size={14} />
                    <Link to={`/team/${user.teamId}`} className="hover:text-airsoft-red transition-colors">
                      {user.team}
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mt-3 sm:mt-0">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <MessageCircle size={14} />
                Message
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <UserPlus size={14} />
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserSearchResults;
