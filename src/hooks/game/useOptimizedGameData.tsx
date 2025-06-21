
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GameData, GameParticipant } from '@/types/game';
import { Profile } from '@/types/profile';
import { toast } from "@/components/ui/use-toast";

export const useOptimizedGameData = (gameId: string | undefined) => {
  const queryFn = async (): Promise<{
    gameData: GameData | null;
    participants: GameParticipant[];
    creatorProfile: Profile | null;
  }> => {
    if (!gameId) return { gameData: null, participants: [], creatorProfile: null };

    console.log('Fetching optimized game data for:', gameId);
    
    const { data, error } = await supabase.rpc('get_game_with_participants', {
      p_game_id: gameId
    });

    if (error) {
      console.error('Error fetching optimized game data:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('No game found for ID:', gameId);
      return { gameData: null, participants: [], creatorProfile: null };
    }

    const result = data[0];
    
    // Safely transform the game data
    const gameData: GameData = {
      ...(result.game_data as unknown as GameData),
      creator: result.creator_profile ? {
        ...(result.creator_profile as unknown as Profile),
        team_logo: null, // This field doesn't exist in profiles table
        newsletter_subscribed: (result.creator_profile as any).newsletter_subscribed ?? null
      } : undefined
    };

    // Safely transform participants data
    const participants: GameParticipant[] = Array.isArray(result.participants) 
      ? result.participants.map((p: any) => ({
          id: p.id,
          user_id: p.user_id,
          game_id: p.game_id,
          status: p.status,
          role: p.role,
          created_at: p.created_at,
          profile: p.profile ? {
            id: p.profile.id,
            username: p.profile.username,
            email: p.profile.email,
            firstname: p.profile.firstname,
            lastname: p.profile.lastname,
            birth_date: p.profile.birth_date,
            age: p.profile.age,
            join_date: p.profile.join_date,
            avatar: p.profile.avatar,
            banner: p.profile.banner,
            bio: p.profile.bio,
            location: p.profile.location,
            phone_number: p.profile.phone_number,
            team: p.profile.team,
            team_id: p.profile.team_id,
            team_logo: null, // This field doesn't exist in profiles table
            is_team_leader: p.profile.is_team_leader,
            is_verified: p.profile.is_verified,
            newsletter_subscribed: p.profile.newsletter_subscribed ?? null,
            Admin: p.profile.Admin,
            Ban: p.profile.Ban,
            ban_date: p.profile.ban_date,
            ban_reason: p.profile.ban_reason,
            banned_by: p.profile.banned_by,
            reputation: p.profile.reputation,
            friends_list_public: p.profile.friends_list_public,
            spoken_language: p.profile.spoken_language
          } : null
        }))
      : [];

    console.log('Optimized game data loaded:', { gameData, participants: participants.length });

    const creatorProfile: Profile | null = result.creator_profile ? {
      id: (result.creator_profile as any).id,
      username: (result.creator_profile as any).username,
      email: (result.creator_profile as any).email,
      firstname: (result.creator_profile as any).firstname,
      lastname: (result.creator_profile as any).lastname,
      birth_date: (result.creator_profile as any).birth_date,
      age: (result.creator_profile as any).age,
      join_date: (result.creator_profile as any).join_date,
      avatar: (result.creator_profile as any).avatar,
      banner: (result.creator_profile as any).banner,
      bio: (result.creator_profile as any).bio,
      location: (result.creator_profile as any).location,
      phone_number: (result.creator_profile as any).phone_number,
      team: (result.creator_profile as any).team,
      team_id: (result.creator_profile as any).team_id,
      team_logo: null, // This field doesn't exist in profiles table
      is_team_leader: (result.creator_profile as any).is_team_leader,
      is_verified: (result.creator_profile as any).is_verified,
      newsletter_subscribed: (result.creator_profile as any).newsletter_subscribed ?? null,
      Admin: (result.creator_profile as any).Admin,
      Ban: (result.creator_profile as any).Ban,
      ban_date: (result.creator_profile as any).ban_date,
      ban_reason: (result.creator_profile as any).ban_reason,
      banned_by: (result.creator_profile as any).banned_by,
      reputation: (result.creator_profile as any).reputation,
      friends_list_public: (result.creator_profile as any).friends_list_public,
      spoken_language: (result.creator_profile as any).spoken_language
    } : null;

    return {
      gameData,
      participants,
      creatorProfile
    };
  };

  return useQuery({
    queryKey: ['optimized-game-data', gameId],
    queryFn,
    enabled: !!gameId,
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    meta: {
      errorHandler: (error: any) => {
        console.error('Optimized game query error:', error);
        if (error.message !== "Failed to fetch") {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger les informations de la partie."
          });
        }
      }
    }
  });
};
