
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User, UserCheck, UserX, UserMinus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Friend {
  id: string;
  username?: string;
  avatar?: string;
  status?: string;
  friend_id?: string;
  user_id?: string;
}

interface UserFriendsListProps {
  userId: string;
}

const UserFriendsList: React.FC<UserFriendsListProps> = ({ userId }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [friendsListPublic, setFriendsListPublic] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    checkFriendsListVisibility();
    fetchFriends();
  }, [userId]);

  const checkFriendsListVisibility = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('friends_list_public')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      setFriendsListPublic(data?.friends_list_public || false);
    } catch (error) {
      console.error('Erreur lors de la vérification de la visibilité de la liste d\'amis:', error);
    }
  };

  const fetchFriends = async () => {
    try {
      setLoading(true);
      
      // Vérifier si l'utilisateur actuel est le propriétaire du profil ou si la liste est publique
      const isProfileOwner = user?.id === userId;
      
      if (!isProfileOwner && !friendsListPublic) {
        // Si la liste n'est pas publique et que l'utilisateur n'est pas le propriétaire, ne pas charger les amis
        setLoading(false);
        return;
      }
      
      // Charger les amis de l'utilisateur
      const { data: friendshipsData, error: friendshipsError } = await supabase
        .from('friendships')
        .select('id, user_id, friend_id, status')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq('status', 'confirmed');
      
      if (friendshipsError) {
        throw friendshipsError;
      }
      
      if (!friendshipsData || friendshipsData.length === 0) {
        setFriends([]);
        setLoading(false);
        return;
      }
      
      // Extraire les IDs des amis
      const friendIds = friendshipsData.map(fs => {
        return fs.user_id === userId ? fs.friend_id : fs.user_id;
      });
      
      // Récupérer les profils des amis
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar')
        .in('id', friendIds);
      
      if (profilesError) {
        throw profilesError;
      }
      
      // Combiner les données de l'amitié avec les profils
      const friendsWithData = profilesData.map(profile => {
        const friendship = friendshipsData.find(fs => 
          fs.user_id === profile.id || fs.friend_id === profile.id
        );
        
        return {
          ...profile,
          status: friendship?.status,
          friendship_id: friendship?.id
        };
      });
      
      setFriends(friendsWithData);
    } catch (error) {
      console.error('Erreur lors du chargement des amis:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste d'amis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async (friendId: string, friendshipId: string) => {
    if (actionLoading) return;
    
    try {
      setActionLoading(friendId);
      
      // Supprimer l'amitié
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);
      
      if (error) throw error;
      
      // Mettre à jour l'état local
      setFriends(prev => prev.filter(friend => friend.id !== friendId));
      
      toast({
        title: "Ami supprimé",
        description: "Cette personne a été retirée de votre liste d'amis."
      });
      
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'ami:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer cet ami",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (!friendsListPublic && user?.id !== userId) {
    return (
      <Card className="p-6 text-center">
        <User className="mx-auto h-12 w-12 text-gray-400 mb-2" />
        <p className="text-gray-500">Cette liste d'amis est privée</p>
      </Card>
    );
  }

  return (
    <div>
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-10 w-10 border-4 border-gray-200 border-t-airsoft-red rounded-full animate-spin"></div>
        </div>
      ) : friends.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {friends.map((friend) => (
            <Card key={friend.id} className="overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={friend.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.id}`} alt={friend.username} />
                    <AvatarFallback>{friend.username?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{friend.username}</h3>
                    <p className="text-xs text-gray-500">
                      {friend.status === 'confirmed' && (
                        <span className="flex items-center text-green-600">
                          <UserCheck className="h-3 w-3 mr-1" /> Ami
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/profile/${friend.id}`}>
                      Profil
                    </Link>
                  </Button>
                  
                  {user?.id === userId && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => removeFriend(friend.id, friend.friendship_id as string)}
                      disabled={actionLoading === friend.id}
                    >
                      {actionLoading === friend.id ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <UserMinus className="h-4 w-4 mr-1" />
                          Retirer
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <UserX className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p className="text-gray-500">Aucun ami à afficher</p>
        </Card>
      )}
    </div>
  );
};

export default UserFriendsList;
