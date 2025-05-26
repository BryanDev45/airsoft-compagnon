
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MapPin, Star, UserPlus, UserMinus, MessageSquare, Shield } from "lucide-react";
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
  is_verified: boolean | null;
  team_id: string | null;
  team_name?: string | null;
  team_logo?: string | null;
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
        .select(`
          id, 
          username, 
          firstname, 
          lastname, 
          avatar, 
          location, 
          reputation, 
          Ban,
          is_verified,
          team_id,
          teams!left(
            name,
            logo
          )
        `)
        .eq('Ban', false)
        .limit(20);
      
      // Ajouter le filtre de recherche seulement si une requête est fournie
      if (query && query.length > 0) {
        queryBuilder = queryBuilder.or(`username.ilike.%${query}%,firstname.ilike.%${query}%,lastname.ilike.%${query}%`);
      }
      
      const { data, error } = await queryBuilder;

      if (error) {
        console.error('Erreur lors de la recherche d\'utilisateurs:', error);
        // Fallback: query without team join if the relationship fails
        const fallbackQuery = supabase
          .from('profiles')
          .select(`
            id, 
            username, 
            firstname, 
            lastname, 
            avatar, 
            location, 
            reputation, 
            Ban,
            is_verified,
            team_id
          `)
          .eq('Ban', false)
          .limit(20);
          
        if (query && query.length > 0) {
          fallbackQuery.or(`username.ilike.%${query}%,firstname.ilike.%${query}%,lastname.ilike.%${query}%`);
        }
        
        const { data: fallbackData, error: fallbackError } = await fallbackQuery;
        
        if (fallbackError) {
          throw fallbackError;
        }
        
        return (fallbackData || []).map(user => ({
          ...user,
          team_name: null,
          team_logo: null
        }));
      }

      // Transform the data to match our UserResult interface
      return (data || []).map(user => ({
        ...user,
        team_name: user.teams?.name || null,
        team_logo: user.teams?.logo || null
      }));
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
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center p-4">
                <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
                <div className="ml-4 space-y-2 flex-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
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
  }

  return (
    <div className="space-y-3">
      {users.map((userData: UserResult) => (
        <Card 
          key={userData.id} 
          className="group overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-transparent hover:border-l-airsoft-red bg-gradient-to-r from-white to-gray-50/50"
        >
          <CardContent className="p-0">
            <div className="flex items-center p-4">
              {/* Avatar Section */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-14 w-14 ring-2 ring-white shadow-sm">
                  {userData.avatar ? (
                    <AvatarImage src={userData.avatar} alt={userData.username} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-airsoft-red to-red-600 text-white font-semibold text-lg">
                      {userData.username?.substring(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                {/* Team logo ou online indicator */}
                {userData.team_logo ? (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-white overflow-hidden">
                    <img 
                      src={userData.team_logo} 
                      alt={userData.team_name || 'Team'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              {/* Info Section - Now with username on the left */}
              <Link 
                to={`/user/${userData.username}`} 
                className="ml-4 flex-1 min-w-0 group-hover:text-airsoft-red transition-colors duration-200"
              >
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate group-hover:text-airsoft-red transition-colors duration-200">
                    {userData.username}
                  </h3>
                  {userData.is_verified && (
                    <Shield className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  )}
                  {userData.team_name && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      {userData.team_name}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {userData.location && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate max-w-32">{userData.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                    <span className="font-medium text-gray-700">
                      {userData.reputation ? userData.reputation.toFixed(1) : '0.0'}
                    </span>
                  </div>
                </div>
              </Link>
              
              {/* Action Buttons */}
              {user && user.id !== userData.id && (
                <div className="flex gap-2 ml-4 flex-shrink-0">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-9 w-9 p-0 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200" 
                    title="Envoyer un message"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  
                  {friendships[userData.id] === 'accepted' ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-9 w-9 p-0 border-red-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all duration-200" 
                      title="Supprimer des amis"
                      onClick={() => handleFriendAction(userData.id, 'remove')}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  ) : friendships[userData.id] === 'pending' ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-9 w-9 p-0 border-gray-200 bg-gray-50 cursor-not-allowed" 
                      title="Demande en cours"
                      disabled
                    >
                      <UserPlus className="h-4 w-4 text-gray-400" />
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-9 w-9 p-0 border-green-200 hover:border-green-300 hover:bg-green-50 hover:text-green-600 transition-all duration-200" 
                      title="Ajouter en ami"
                      onClick={() => handleFriendAction(userData.id, 'add')}
                    >
                      <UserPlus className="h-4 w-4" />
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
