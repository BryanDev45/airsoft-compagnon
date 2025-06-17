
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Friend {
  id: string;
  username: string;
  avatar?: string;
  location?: string;
}

export const useFriendsList = () => {
  const { user } = useAuth();

  const { data: friends = [], isLoading, error } = useQuery<Friend[], Error>({
    queryKey: ['friends', user?.id],
    queryFn: async (): Promise<Friend[]> => {
      if (!user?.id) return [];

      try {
        // Récupérer les amitiés acceptées
        const { data: friendships, error: friendshipsError } = await supabase
          .from('friendships')
          .select('user_id, friend_id')
          .eq('status', 'accepted')
          .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

        if (friendshipsError) {
          console.error('Erreur lors de la récupération des amitiés:', friendshipsError);
          throw friendshipsError;
        }

        if (!friendships || friendships.length === 0) {
          return [];
        }

        // Extraire les IDs des amis (excluant l'utilisateur actuel)
        const friendIds = friendships.map(friendship => 
          friendship.user_id === user.id ? friendship.friend_id : friendship.user_id
        );

        // Récupérer les profils des amis
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar, location')
          .in('id', friendIds);

        if (profilesError) {
          console.error('Erreur lors de la récupération des profils:', profilesError);
          throw profilesError;
        }

        return profiles || [];
      } catch (error) {
        console.error('Erreur dans useFriendsList:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 300000, // 5 minutes
    gcTime: 600000, // 10 minutes
  });

  return {
    friends,
    isLoading,
    error
  };
};
