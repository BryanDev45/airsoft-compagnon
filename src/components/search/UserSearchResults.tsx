
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
    enabled: true,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      refetch();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, refetch]);

  useEffect(() => {
    if (!user) return;
    
    const fetchFriendshipStatus = async () => {
      try {
        const statusMap: Record<string, string> = {};
        
        for (const userData of users) {
          if (userData.id === user.id) continue;
          
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
        const { error } = await supabase
          .from('friendships')
          .insert({
            user_id: user.id,
            friend_id: targetUserId,
            status: 'pending'
          });

        if (error) throw error;
        
        setFriendships(prev => ({
          ...prev,
          [targetUserId]: 'pending'
        }));
        
        toast({
          title: "Succès",
          description: "Demande d'ami envoyée"
        });
      } else {
        const { error } = await supabase
          .from('friendships')
          .delete()
          .or(`user_id.eq.${user.id},user_id.eq.${targetUserId}`)
          .or(`friend_id.eq.${user.id},friend_id.eq.${targetUserId}`);

        if (error) throw error;
        
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
          <Card key={index} className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full border-4 border-white shadow-lg" />
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
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
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200">
          <div className="text-gray-400 text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {searchQuery ? 'Aucun joueur trouvé' : 'Recherchez des joueurs'}
          </h3>
          <p className="text-gray-500 text-sm">
            {searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Entrez un nom pour commencer votre recherche'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((userData: UserResult) => (
        <Card 
          key={userData.id} 
          className="group overflow-hidden bg-gradient-to-r from-white via-gray-50/50 to-white hover:from-blue-50/30 hover:via-purple-50/20 hover:to-pink-50/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/50 border-l-4 border-l-transparent hover:border-l-gradient-to-b hover:border-l-blue-400"
        >
          {/* Bande décorative en haut */}
          <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
          
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Link 
                to={`/user/${userData.username}`} 
                className="flex items-center gap-5 flex-1 group-hover:scale-[1.01] transition-transform duration-200"
              >
                {/* Avatar avec effet stylisé */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 scale-110" />
                  <Avatar className="h-16 w-16 border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300 relative z-10">
                    {userData.avatar ? (
                      <AvatarImage src={userData.avatar} alt={userData.username} className="object-cover" />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 font-bold text-lg">
                        {userData.username?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {/* Indicateur en ligne */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-3 border-white rounded-full shadow-sm" />
                </div>

                {/* Informations utilisateur */}
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                      {userData.username}
                    </h3>
                    {(userData.firstname || userData.lastname) && (
                      <p className="text-sm text-gray-500 font-medium">
                        {[userData.firstname, userData.lastname].filter(Boolean).join(' ')}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    {userData.location && (
                      <div className="flex items-center gap-1.5 text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        <MapPin className="h-3.5 w-3.5 text-gray-500" />
                        <span className="font-medium">{userData.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold">
                        {userData.reputation ? userData.reputation.toFixed(1) : '0.0'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* Boutons d'action stylisés */}
              {user && user.id !== userData.id && (
                <div className="flex gap-2 items-center ml-4">
                  {/* Bouton Message */}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-10 w-10 p-0 border-2 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group/btn" 
                    title="Envoyer un message"
                  >
                    <MessageSquare className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
                  </Button>
                  
                  {/* Bouton Ami */}
                  {friendships[userData.id] === 'accepted' ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-10 w-10 p-0 border-2 border-red-200 bg-red-50 hover:border-red-300 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-200 group/btn" 
                      title="Supprimer des amis"
                      onClick={() => handleFriendAction(userData.id, 'remove')}
                    >
                      <UserMinus className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
                    </Button>
                  ) : friendships[userData.id] === 'pending' ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-10 w-10 p-0 border-2 border-yellow-200 bg-yellow-50 text-yellow-600 cursor-not-allowed opacity-75" 
                      title="Demande en cours"
                      disabled
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-10 w-10 p-0 border-2 border-green-200 bg-green-50 hover:border-green-300 hover:bg-green-100 text-green-600 hover:text-green-700 transition-all duration-200 group/btn" 
                      title="Ajouter en ami"
                      onClick={() => handleFriendAction(userData.id, 'add')}
                    >
                      <UserPlus className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
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
