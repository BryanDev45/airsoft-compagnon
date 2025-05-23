
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MapPin, Star, UserPlus, UserMinus, MessageSquare } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface UserSearchResultsProps {
  searchQuery: string;
}

interface UserResult {
  id: string;
  username: string;
  firstname: string | null;
  lastname: string | null;
  avatar: string | null;
  location: string | null;
  reputation: number | null;
  Ban: boolean;
}

const UserSearchResults: React.FC<UserSearchResultsProps> = ({ searchQuery }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [friendships, setFriendships] = useState<Record<string, string>>({});
  
  // Utilisez useQuery pour mettre en cache et optimiser la recherche
  const {
    data: users = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['userSearch', searchQuery],
    queryFn: () => searchUsers(searchQuery),
    enabled: true, // Permettre la recherche même sans caractères minimum
    staleTime: 30000, // Cache valide pendant 30 secondes
    refetchOnWindowFocus: false,
  });

  // Déclencher la recherche lorsque la requête change, mais avec un délai
  useEffect(() => {
    const handler = setTimeout(() => {
      refetch();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, refetch]);

  // Récupérer le statut d'amitié pour chaque utilisateur affiché
  useEffect(() => {
    if (!user) return;
    
    const fetchFriendshipStatus = async () => {
      try {
        const statusMap: Record<string, string> = {};
        
        // Pour chaque utilisateur dans les résultats, vérifier le statut d'amitié
        for (const userData of users) {
          if (userData.id === user.id) continue; // Ignorer notre propre utilisateur
          
          const { data, error } = await supabase.rpc('check_friendship_status', { 
            p_user_id: user.id, 
            p_friend_id: userData.id 
          });
          
          if (!error && data) {
            statusMap[userData.id] = data;
          }
        }
        
        setFriendships(statusMap);
      } catch (error) {
        console.error('Erreur lors de la récupération des statuts d\'amitié:', error);
      }
    };
    
    if (users.length > 0) {
      fetchFriendshipStatus();
    }
  }, [user, users]);

  // Fonction de recherche d'utilisateurs
  async function searchUsers(query: string) {
    try {
      let queryBuilder = supabase
        .from('profiles')
        .select('id, username, firstname, lastname, avatar, location, reputation, Ban')
        .eq('Ban', false)
        .limit(20);
      
      // Ajouter le filtre de recherche seulement si une requête est fournie
      if (query && query.length > 0) {
        queryBuilder = queryBuilder.or(`username.ilike.%${query}%,firstname.ilike.%${query}%,lastname.ilike.%${query}%`);
      }
      
      const { data, error } = await queryBuilder;

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erreur lors de la recherche d\'utilisateurs:', error);
      return [];
    }
  }

  // Gérer l'ajout ou la suppression d'un ami
  const handleFriendAction = async (targetUserId: string, action: 'add' | 'remove') => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer cette action",
        variant: "destructive"
      });
      return;
    }

    try {
      if (action === 'add') {
        // Envoyer une demande d'ami
        const { error } = await supabase
          .from('friendships')
          .insert({
            user_id: user.id,
            friend_id: targetUserId,
            status: 'pending'
          });

        if (error) throw error;
        
        // Mettre à jour l'état local
        setFriendships(prev => ({
          ...prev,
          [targetUserId]: 'pending'
        }));
        
        toast({
          title: "Succès",
          description: "Demande d'ami envoyée"
        });
      } else {
        // Supprimer l'amitié
        const { error } = await supabase
          .from('friendships')
          .delete()
          .or(`user_id.eq.${user.id},user_id.eq.${targetUserId}`)
          .or(`friend_id.eq.${user.id},friend_id.eq.${targetUserId}`);

        if (error) throw error;
        
        // Mettre à jour l'état local
        setFriendships(prev => {
          const newState = { ...prev };
          delete newState[targetUserId];
          return newState;
        });
        
        toast({
          title: "Succès",
          description: "Ami supprimé"
        });
      }
      
      // Rafraîchir les résultats
      refetch();
    } catch (error) {
      console.error('Erreur lors de la gestion d\'amitié:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {searchQuery ? `Aucun joueur trouvé pour "${searchQuery}"` : 'Entrez votre recherche pour trouver des joueurs'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((userData: UserResult) => (
        <Card className="hover:bg-gray-50 transition duration-150" key={userData.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Link to={`/profile/${userData.username}`} className="flex items-center gap-4 flex-1">
                <Avatar className="h-12 w-12">
                  {userData.avatar ? (
                    <AvatarImage src={userData.avatar} alt={userData.username} />
                  ) : (
                    <AvatarFallback>{userData.username?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-medium">{userData.username}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    {userData.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{userData.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{userData.reputation ? userData.reputation.toFixed(1) : '0.0'}</span>
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* Buttons section - only show for other users, not the current user */}
              {user && user.id !== userData.id && (
                <div className="flex gap-2 items-center">
                  {/* Message button */}
                  <Button size="sm" variant="outline" className="h-9 w-9 p-0" title="Envoyer un message">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  
                  {/* Friend action button based on friendship status */}
                  {friendships[userData.id] === 'accepted' ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-9 w-9 p-0" 
                      title="Supprimer des amis"
                      onClick={() => handleFriendAction(userData.id, 'remove')}
                    >
                      <UserMinus className="h-4 w-4 text-red-500" />
                    </Button>
                  ) : friendships[userData.id] === 'pending' ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-9 w-9 p-0" 
                      title="Demande en cours"
                      disabled
                    >
                      <UserPlus className="h-4 w-4 text-gray-400" />
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-9 w-9 p-0" 
                      title="Ajouter en ami"
                      onClick={() => handleFriendAction(userData.id, 'add')}
                    >
                      <UserPlus className="h-4 w-4 text-green-500" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserSearchResults;
