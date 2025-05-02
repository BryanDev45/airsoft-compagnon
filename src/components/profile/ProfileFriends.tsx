
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, UserCheck, Trash } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ProfileFriends = ({ userId, isOwnProfile }) => {
  const [friends, setFriends] = React.useState([]);
  const [pendingRequests, setPendingRequests] = React.useState([]);
  const navigate = useNavigate();

  const fetchFriends = async () => {
    try {
      // Récupérer les amis acceptés où l'utilisateur est "user_id"
      const { data: acceptedFriends, error: friendsError } = await supabase
        .from('friendships')
        .select('id, friend_id')
        .eq('user_id', userId)
        .eq('status', 'accepted');

      if (friendsError) throw friendsError;
      
      // Fetch friend profiles separately to avoid relationship issues
      let friendProfiles = [];
      if (acceptedFriends && acceptedFriends.length > 0) {
        const friendIds = acceptedFriends.map(f => f.friend_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar, team, location')
          .in('id', friendIds);
          
        if (profilesError) throw profilesError;
        
        // Combine friendship and profile data
        friendProfiles = acceptedFriends.map(friendship => {
          const profile = profilesData?.find(p => p.id === friendship.friend_id);
          return profile ? {
            friendshipId: friendship.id,
            id: profile.id,
            username: profile.username,
            avatar: profile.avatar,
            team: profile.team,
            location: profile.location
          } : null;
        }).filter(Boolean);
      }

      // Récupérer également les amis où l'utilisateur est "friend_id"
      const { data: acceptedFriendsReverse, error: friendsErrorReverse } = await supabase
        .from('friendships')
        .select('id, user_id')
        .eq('friend_id', userId)
        .eq('status', 'accepted');

      if (friendsErrorReverse) throw friendsErrorReverse;
      
      // Fetch the other direction friend profiles separately
      let friendProfilesReverse = [];
      if (acceptedFriendsReverse && acceptedFriendsReverse.length > 0) {
        const friendIds = acceptedFriendsReverse.map(f => f.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar, team, location')
          .in('id', friendIds);
          
        if (profilesError) throw profilesError;
        
        // Combine friendship and profile data
        friendProfilesReverse = acceptedFriendsReverse.map(friendship => {
          const profile = profilesData?.find(p => p.id === friendship.user_id);
          return profile ? {
            friendshipId: friendship.id,
            id: profile.id,
            username: profile.username,
            avatar: profile.avatar,
            team: profile.team,
            location: profile.location
          } : null;
        }).filter(Boolean);
      }

      // Combine all friends
      const allFriends = [...friendProfiles, ...friendProfilesReverse];
      setFriends(allFriends);

      // Récupérer les demandes en attente uniquement si c'est le profil de l'utilisateur connecté
      if (isOwnProfile) {
        const { data: pending, error: pendingError } = await supabase
          .from('friendships')
          .select('id, user_id')
          .eq('friend_id', userId)
          .eq('status', 'pending');

        if (pendingError) throw pendingError;
        
        // Fetch pending request profiles separately
        let pendingProfiles = [];
        if (pending && pending.length > 0) {
          const pendingIds = pending.map(p => p.user_id);
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, avatar, team, location')
            .in('id', pendingIds);
            
          if (profilesError) throw profilesError;
          
          // Combine pending request and profile data
          pendingProfiles = pending.map(request => {
            const profile = profilesData?.find(p => p.id === request.user_id);
            return profile ? {
              friendshipId: request.id,
              id: profile.id,
              username: profile.username,
              avatar: profile.avatar,
              team: profile.team,
              location: profile.location
            } : null;
          }).filter(Boolean);
        }
        
        setPendingRequests(pendingProfiles);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des amis:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste d'amis",
        variant: "destructive"
      });
    }
  };

  const handleAcceptFriend = async (friendshipId) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', friendshipId);

      if (error) throw error;
      
      toast({
        title: "Demande acceptée",
        description: "Vous êtes maintenant amis",
      });
      
      fetchFriends();
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de la demande d\'ami:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter la demande d'ami",
        variant: "destructive"
      });
    }
  };

  const handleRejectFriend = async (friendshipId) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'rejected' })
        .eq('id', friendshipId);

      if (error) throw error;
      
      toast({
        title: "Demande rejetée",
        description: "La demande d'ami a été rejetée",
      });
      
      fetchFriends();
    } catch (error) {
      console.error('Erreur lors du rejet de la demande d\'ami:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rejeter la demande d'ami",
        variant: "destructive"
      });
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);

      if (error) throw error;
      
      toast({
        title: "Ami supprimé",
        description: "L'ami a été retiré de votre liste",
      });
      
      fetchFriends();
    } catch (error) {
      console.error('Erreur lors de la suppression d\'un ami:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer cet ami",
        variant: "destructive"
      });
    }
  };

  const navigateToSearch = () => {
    navigate('/parties?tab=joueurs');
  };

  React.useEffect(() => {
    if (userId) {
      fetchFriends();
    }
  }, [userId]);

  return (
    <div className="space-y-6">
      {isOwnProfile && (
        <div className="flex justify-end mb-4">
          <Button 
            variant="default"
            onClick={navigateToSearch}
            className="bg-airsoft-red hover:bg-red-700 text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Rechercher des joueurs
          </Button>
        </div>
      )}

      {isOwnProfile && pendingRequests.length > 0 && (
        <div className="bg-gradient-to-r from-airsoft-red/10 to-red-100 p-6 rounded-lg border border-airsoft-red/20">
          <h3 className="text-lg font-medium mb-4 text-airsoft-red">Demandes d'amitié en attente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={request.avatar || '/placeholder.svg'} alt={request.username} />
                    <AvatarFallback>{request.username?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{request.username}</p>
                    {request.team && (
                      <p className="text-sm text-gray-500">{request.team}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleAcceptFriend(request.friendshipId)}
                    className="bg-airsoft-red hover:bg-red-700"
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Accepter
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRejectFriend(request.friendshipId)}
                  >
                    <UserMinus className="h-4 w-4 mr-1" />
                    Refuser
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Amis</h3>
        {friends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend) => (
              <Card key={friend.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={friend.avatar || '/placeholder.svg'} alt={friend.username} />
                    <AvatarFallback>{friend.username?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{friend.username}</span>
                </div>
                {isOwnProfile && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleRemoveFriend(friend.id)}
                  >
                    <UserMinus className="h-4 w-4 mr-1" />
                    Retirer
                  </Button>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Aucun ami pour le moment</p>
        )}
      </Card>
    </div>
  );
};

export default ProfileFriends;
