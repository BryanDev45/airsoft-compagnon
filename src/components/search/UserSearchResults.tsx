
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Shield, MessageCircle, UserPlus, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/useAuth';

interface UserSearchResultsProps {
  searchQuery: string;
}

const UserSearchResults = ({ searchQuery }: UserSearchResultsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('profiles')
          .select('id, username, avatar, location, team, team_id, bio, is_verified, join_date');
        
        // Ignore current user
        if (user?.id) {
          query = query.neq('id', user.id);
        }
        
        // Apply search filter if query exists
        if (searchQuery.length > 0) {
          query = query.or(`username.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,team.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`);
        }
        
        // Limit results
        query = query.limit(20);
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setUsers(data || []);
      } catch (error: any) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les utilisateurs",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [searchQuery, user?.id]);
  
  const handleNavigateToProfile = (username: string) => {
    navigate(`/user/${username}`);
  };

  const handleSendMessage = (userId: string) => {
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
      description: `Envoi d'un message à ${users.find(u => u.id === userId)?.username}`,
    });
    
    // Dans une implémentation réelle, rediriger vers la messagerie avec ce contact
    navigate('/messages');
  };

  const handleAddFriend = async (userId: string) => {
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
      // Vérifier si une demande existe déjà
      const { data: existingRequest, error: checkError } = await supabase
        .from('friendships')
        .select('*')
        .or(`and(user_id.eq.${user.id},friend_id.eq.${userId}),and(user_id.eq.${userId},friend_id.eq.${user.id})`)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingRequest) {
        toast({
          title: "Information",
          description: "Une demande d'ami existe déjà avec cet utilisateur",
        });
        return;
      }
      
      const targetUser = users.find(u => u.id === userId);
      
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: user.id,
          friend_id: userId,
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
  const renderRatingStars = (rating: number = 0) => {
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
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-pulse text-gray-500">Chargement des joueurs...</div>
      </div>
    );
  }
  
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun joueur trouvé</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {users.map(user => (
        <div key={user.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div 
              className="flex-shrink-0 cursor-pointer" 
              onClick={() => handleNavigateToProfile(user.username)}
            >
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                <AvatarFallback>{user.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span 
                  className="font-semibold hover:text-airsoft-red transition-colors cursor-pointer"
                  onClick={() => handleNavigateToProfile(user.username)}
                >
                  {user.username || "Anonyme"}
                </span>
                {user.is_verified && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Vérifié
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center mb-2">
                {renderRatingStars(0)}
                <span className="ml-2 text-sm text-gray-600">0.0</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{user.bio || "Aucune bio"}</p>
              
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
                    <Link to={`/team/${user.team_id}`} className="hover:text-airsoft-red transition-colors">
                      {user.team}
                    </Link>
                  </div>
                )}
                
                {user.join_date && (
                  <div className="text-xs text-gray-400">
                    Membre depuis {new Date(user.join_date).toLocaleDateString()}
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
