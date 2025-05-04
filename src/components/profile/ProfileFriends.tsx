
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, UserCheck } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const ProfileFriends = ({ userId, isOwnProfile }) => {
  const [friends, setFriends] = React.useState([]);
  const [pendingRequests, setPendingRequests] = React.useState([]);
  const [isFriendsListPublic, setIsFriendsListPublic] = React.useState(false);
  const navigate = useNavigate();

  // Fetch profile data including friends list privacy setting
  const fetchProfileSettings = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('friends_list_public')
        .eq('id', userId)
        .single();
        
      if (!error && data) {
        setIsFriendsListPublic(data.friends_list_public || false);
      }
    } catch (error) {
      console.error("Error fetching profile settings:", error);
    }
  };

  const fetchFriends = async () => {
    try {
      // Récupérer les amis (statut accepté)
      const { data: friendships, error: friendsError } = await supabase
        .from('friendships')
        .select('friend_id')
        .eq('user_id', userId)
        .eq('status', 'accepted');

      if (friendsError) throw friendsError;

      // Récupérer aussi les amitiés où l'utilisateur est le friend_id
      const { data: reverseFriendships, error: reverseFriendsError } = await supabase
        .from('friendships')
        .select('user_id')
        .eq('friend_id', userId)
        .eq('status', 'accepted');

      if (reverseFriendsError) throw reverseFriendsError;

      // Combiner les deux listes d'IDs d'amis
      const friendIds = [
        ...friendships.map(f => f.friend_id),
        ...reverseFriendships.map(f => f.user_id)
      ];

      if (friendIds.length > 0) {
        // Récupérer les profils des amis
        const { data: friendProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', friendIds);

        if (profilesError) throw profilesError;
        setFriends(friendProfiles || []);
      } else {
        setFriends([]);
      }

      // Si c'est le propre profil de l'utilisateur, récupérer les demandes d'amitié en attente
      if (isOwnProfile) {
        const { data: pendingFriendships, error: pendingError } = await supabase
          .from('friendships')
          .select('user_id')
          .eq('friend_id', userId)
          .eq('status', 'pending');

        if (pendingError) throw pendingError;

        if (pendingFriendships && pendingFriendships.length > 0) {
          const pendingUserIds = pendingFriendships.map(p => p.user_id);
          
          const { data: pendingProfiles, error: pendingProfilesError } = await supabase
            .from('profiles')
            .select('*')
            .in('id', pendingUserIds);

          if (pendingProfilesError) throw pendingProfilesError;
          setPendingRequests(pendingProfiles || []);
        } else {
          setPendingRequests([]);
        }
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

  const handleAcceptFriend = async (friendId) => {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('user_id', friendId)
      .eq('friend_id', userId);

    if (!error) {
      toast({
        title: "Demande acceptée",
        description: "Vous êtes maintenant amis",
      });
      fetchFriends();
    }
  };

  const handleRejectFriend = async (friendId) => {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'rejected' })
      .eq('user_id', friendId)
      .eq('friend_id', userId);

    if (!error) {
      toast({
        title: "Demande rejetée",
        description: "La demande d'ami a été rejetée",
      });
      fetchFriends();
    }
  };

  const handleRemoveFriend = async (friendId) => {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);

    if (!error) {
      toast({
        title: "Ami supprimé",
        description: "L'ami a été retiré de votre liste",
      });
      fetchFriends();
    }
  };

  const navigateToSearch = () => {
    navigate('/parties?tab=players');
  };

  const navigateToUserProfile = (username) => {
    navigate(`/user/${username}`);
  };

  const handleToggleFriendsListVisibility = async () => {
    const newValue = !isFriendsListPublic;
    const { error } = await supabase
      .from('profiles')
      .update({ friends_list_public: newValue })
      .eq('id', userId);
    
    if (error) {
      console.error("Error updating friends list visibility:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la visibilité de la liste d'amis",
        variant: "destructive"
      });
    } else {
      setIsFriendsListPublic(newValue);
      toast({
        title: "Paramètre mis à jour",
        description: `Votre liste d'amis est maintenant ${newValue ? 'publique' : 'privée'}`,
      });
    }
  };

  React.useEffect(() => {
    if (userId) {
      fetchFriends();
      fetchProfileSettings();
    }
  }, [userId]);

  // Si ce n'est pas le profil de l'utilisateur connecté et que la liste d'amis est privée, masquer le contenu
  const shouldShowFriendsList = isOwnProfile || isFriendsListPublic;

  return (
    <div className="space-y-6">
      {isOwnProfile && (
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <Switch 
              id="public-friends-list"
              checked={isFriendsListPublic} 
              onCheckedChange={handleToggleFriendsListVisibility}
            />
            <Label htmlFor="public-friends-list" className="text-sm font-medium">
              Liste d'amis publique
            </Label>
          </div>
          
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
                <div 
                  className="flex items-center space-x-4 cursor-pointer hover:text-airsoft-red"
                  onClick={() => navigateToUserProfile(request.username)}
                >
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
                    onClick={() => handleAcceptFriend(request.id)}
                    className="bg-airsoft-red hover:bg-red-700"
                  >
                    Accepter
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRejectFriend(request.id)}
                  >
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
        
        {!shouldShowFriendsList ? (
          <p className="text-center text-gray-500">Cette liste d'amis est privée</p>
        ) : friends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend) => (
              <Card 
                key={friend.id} 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigateToUserProfile(friend.username)}
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={friend.avatar || '/placeholder.svg'} alt={friend.username} />
                    <AvatarFallback>{friend.username?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="hover:text-airsoft-red transition-colors">{friend.username}</span>
                </div>
                {isOwnProfile && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation when clicking the button
                      handleRemoveFriend(friend.id);
                    }}
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
