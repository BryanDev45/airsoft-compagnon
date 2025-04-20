
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Shield, MessageCircle, UserPlus, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/useAuth';

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
    verified: true,
    rating: 4.8
  },
  {
    id: 2,
    username: "SniperElite",
    avatar: "/placeholder.svg",
    location: "Lyon, France",
    team: "Ghost Team",
    teamId: "2",
    bio: "Sniper et tireur de précision, amateur de parties MilSim",
    verified: false,
    rating: 4.2
  },
  {
    id: 3,
    username: "TacticCool",
    avatar: "/placeholder.svg",
    location: "Marseille, France",
    team: "Strike Force",
    teamId: "3",
    bio: "Équipement tactique et stratégies militaires",
    verified: true,
    rating: 4.5
  }
];

interface UserSearchResultsProps {
  searchQuery: string;
}

const UserSearchResults = ({ searchQuery }: UserSearchResultsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
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

  const handleSendMessage = (userId: number) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour envoyer un message",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    toast({
      title: "Message",
      description: `Envoi d'un message à ${mockUsers.find(u => u.id === userId)?.username}`,
    });
    
    // Dans une implémentation réelle, rediriger vers la messagerie avec ce contact
    navigate('/messages');
  };

  const handleAddFriend = async (userId: number) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour ajouter un ami",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    try {
      const targetUser = mockUsers.find(u => u.id === userId);
      
      // En production, ce serait l'ID réel de l'utilisateur
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: user.id,
          friend_id: targetUser?.id.toString(),
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Demande envoyée",
        description: `Demande d'ami envoyée à ${targetUser?.username}`,
      });
    } catch (error: any) {
      console.error("Erreur lors de l'envoi de la demande d'ami:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande d'ami",
        variant: "destructive"
      });
    }
  };

  // Function to render rating stars
  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="relative">
          <Star className="h-4 w-4 text-gray-300" />
          <Star className="absolute top-0 left-0 h-4 w-4 text-yellow-400 overflow-hidden" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        </span>
      );
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
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
              
              <div className="flex items-center mb-2">
                {renderRatingStars(user.rating)}
                <span className="ml-2 text-sm text-gray-600">{user.rating.toFixed(1)}</span>
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
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => handleSendMessage(user.id)}
              >
                <MessageCircle size={14} />
                Message
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => handleAddFriend(user.id)}
              >
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
