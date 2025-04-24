
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileGames from '../components/profile/ProfileGames';
import ProfileStats from '../components/profile/ProfileStats';
import ProfileEquipment from '../components/profile/ProfileEquipment';
import ProfileBadges from '../components/profile/ProfileBadges';
import ProfileDialogs from '../components/profile/ProfileDialogs';
import ReportUserButton from '../components/profile/ReportUserButton';
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Check } from "lucide-react";
import RatingStars from '../components/profile/RatingStars';

/**
 * Helper function to call Supabase RPC functions with type safety bypassing
 */
const callRPC = async <T,>(functionName: string, params: Record<string, any> = {}): Promise<{data: T | null, error: Error | null}> => {
  try {
    // @ts-ignore - We're intentionally bypassing TypeScript's type checking here
    const result = await supabase.rpc(functionName, params);
    return result;
  } catch (error) {
    console.error(`Error calling RPC function ${functionName}:`, error);
    return { data: null, error: error as Error };
  }
};

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [userGames, setUserGames] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showAllGamesDialog, setShowAllGamesDialog] = useState(false);
  const [showBadgesDialog, setShowBadgesDialog] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  
  const equipmentTypes = ["Réplique principale", "Réplique secondaire", "Protection", "Accessoire"];
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.id) {
        setCurrentUserId(data.session.user.id);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError) throw profileError;
        
        if (!userProfile) {
          toast({
            title: "Utilisateur non trouvé",
            description: "Ce profil n'existe pas",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        if (currentUserId) {
          const { data: friendship, error: friendshipError } = await supabase
            .from('friendships')
            .select('*')
            .eq('user_id', currentUserId)
            .eq('friend_id', userProfile.id)
            .single();
            
          if (!friendshipError && friendship) {
            setIsFollowing(friendship.status === 'accepted');
            setFriendRequestSent(friendship.status === 'pending');
          }
          
          // Call RPC with our helper function
          const { data: ratings, error: ratingsError } = await callRPC<number>('get_user_rating', { 
            p_rater_id: currentUserId, 
            p_rated_id: userProfile.id 
          });
            
          if (!ratingsError && ratings) {
            setUserRating(ratings);
            setHasRated(true);
          }
        }

        const { data: stats, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userProfile.id)
          .maybeSingle();

        if (statsError && statsError.code !== 'PGRST116') {
          throw statsError;
        }

        const { data: userEquipment, error: equipmentError } = await supabase
          .from('equipment')
          .select('*')
          .eq('user_id', userProfile.id);

        if (equipmentError) throw equipmentError;

        const { data: games, error: gamesError } = await supabase
          .from('game_participants')
          .select(`
            status,
            role,
            games (
              id,
              title,
              date,
              location,
              status,
              image
            )
          `)
          .eq('user_id', userProfile.id)
          .limit(5);

        if (gamesError) throw gamesError;

        let formattedGames = [];
        if (games && games.length > 0) {
          formattedGames = games.map(entry => ({
            id: entry.games.id,
            title: entry.games.title,
            date: new Date(entry.games.date).toLocaleDateString('fr-FR'),
            location: entry.games.location,
            image: entry.games.image || '/placeholder.svg',
            role: entry.role,
            status: entry.games.status,
            team: 'Indéfini',
            result: entry.status
          }));
        }

        const { data: badges, error: badgesError } = await supabase
          .from('user_badges')
          .select(`
            date,
            badges (
              id,
              name,
              description,
              icon,
              background_color,
              border_color
            )
          `)
          .eq('user_id', userProfile.id);

        if (badgesError) throw badgesError;

        let formattedBadges = [];
        if (badges && badges.length > 0) {
          formattedBadges = badges.map(entry => ({
            id: entry.badges.id,
            name: entry.badges.name,
            description: entry.badges.description,
            icon: entry.badges.icon || '/placeholder.svg',
            date: new Date(entry.date).toLocaleDateString('fr-FR'),
            backgroundColor: entry.badges.background_color || '#f8f9fa',
            borderColor: entry.badges.border_color || '#e9ecef'
          }));
        }

        if (formattedGames.length === 0) {
          formattedGames = [
            {
              id: '1',
              title: 'Aucune partie jouée',
              date: '-',
              location: '-',
              image: '/placeholder.svg',
              role: '-',
              team: '-',
              result: '-',
              status: 'Aucune'
            }
          ];
        }

        if (formattedBadges.length === 0) {
          formattedBadges = [];
        }

        const enrichedProfile = {
          ...userProfile,
          games: formattedGames,
          allGames: [...formattedGames],
          badges: formattedBadges
        };

        setUserData({ id: userProfile.id, ...enrichedProfile });
        setProfileData(enrichedProfile);
        setUserStats(stats || {
          user_id: userProfile.id,
          games_played: 0,
          preferred_game_type: 'Indéfini',
          favorite_role: 'Indéfini',
          level: 'Débutant',
          reputation: 0,
          win_rate: '0%',
          accuracy: '0%',
          time_played: '0h',
          objectives_completed: 0,
          flags_captured: 0,
          tactical_awareness: 'À évaluer'
        });
        setEquipment(userEquipment || []);
        setUserGames(formattedGames);
        setUserBadges(formattedBadges);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données de l'utilisateur",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    if (username && currentUserId) {
      fetchUserData();
    } else if (username) {
      fetchUserData();
    }
  }, [username, navigate, currentUserId]);

  const handleFollowUser = async () => {
    if (!currentUserId) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour ajouter un ami",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFollowing) {
        const { error } = await supabase
          .from('friendships')
          .delete()
          .or(`and(user_id.eq.${currentUserId},friend_id.eq.${userData.id}),and(user_id.eq.${userData.id},friend_id.eq.${currentUserId})`);

        if (error) throw error;

        setIsFollowing(false);
        setFriendRequestSent(false);
        toast({
          title: "Ami retiré",
          description: "Cet utilisateur a été retiré de vos amis",
        });
      } else if (friendRequestSent) {
        const { error } = await supabase
          .from('friendships')
          .delete()
          .eq('user_id', currentUserId)
          .eq('friend_id', userData.id);

        if (error) throw error;

        setFriendRequestSent(false);
        toast({
          title: "Demande annulée",
          description: "Votre demande d'amitié a été annulée",
        });
      } else {
        const { error } = await supabase
          .from('friendships')
          .insert({
            user_id: currentUserId,
            friend_id: userData.id,
            status: 'pending'
          });

        if (error) throw error;

        setFriendRequestSent(true);
        toast({
          title: "Demande envoyée",
          description: "Votre demande d'amitié a été envoyée",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la gestion de l'amitié:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'action",
        variant: "destructive",
      });
    }
  };

  const handleRatingChange = async (rating: number) => {
    if (!currentUserId) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour noter un utilisateur",
        variant: "destructive",
      });
      return;
    }

    try {
      if (hasRated) {
        const { error } = await callRPC('update_user_rating', { 
          p_rater_id: currentUserId, 
          p_rated_id: userData.id, 
          p_rating: rating 
        });
          
        if (error) throw error;
      } else {
        const { error } = await callRPC('insert_user_rating', { 
          p_rater_id: currentUserId, 
          p_rated_id: userData.id, 
          p_rating: rating 
        });
          
        if (error) throw error;
        setHasRated(true);
      }

      setUserRating(rating);
      
      // Update average reputation
      const { data: avgRating, error: avgError } = await callRPC<number>('get_average_rating', 
        { p_user_id: userData.id }
      );
      
      if (!avgError && avgRating !== null) {
        // Update profile data locally
        if (profileData) {
          setProfileData({
            ...profileData,
            reputation: avgRating
          });
        }
      }
      
      toast({
        title: "Notation enregistrée",
        description: "Votre évaluation a été prise en compte",
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la notation:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre évaluation",
        variant: "destructive",
      });
    }
  };

  const handleNavigateToGame = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  const handleNavigateToTeam = () => {
    if (profileData?.team_id) {
      navigate(`/team/${profileData.team_id}`);
    }
  };

  const setEditing = () => {
    toast({
      title: "Information",
      description: "Cette fonction n'est pas disponible sur les profils des autres utilisateurs.",
    });
  };

  const toggleProfileSettings = () => {
    toast({
      title: "Information",
      description: "Cette fonction n'est pas disponible sur les profils des autres utilisateurs.",
    });
  };

  const onEditBio = () => {
    toast({
      title: "Information",
      description: "Cette fonction n'est pas disponible sur les profils des autres utilisateurs.",
    });
  };

  const updateLocation = async () => {
    console.log("updateLocation called, but not available in UserProfile view");
    return false;
  };

  const updateUserStats = async () => {
    console.log("updateUserStats called, but not available in UserProfile view");
    return false;
  };
  
  const fetchProfileData = async () => {
    console.log("Fetching profile data for user ID:", profileData?.id);
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">Chargement...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <ProfileHeader 
                user={profileData} 
                isOwnProfile={false}
                setEditing={setEditing}
                toggleProfileSettings={toggleProfileSettings}
                onEditBio={onEditBio}
              />
              
              <div className="absolute top-4 right-4 flex space-x-2">
                {currentUserId && currentUserId !== userData?.id && (
                  <Button 
                    onClick={handleFollowUser}
                    variant={isFollowing || friendRequestSent ? "outline" : "default"}
                    className={isFollowing || friendRequestSent ? "bg-white text-black border-gray-300" : "bg-airsoft-red text-white"}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="mr-2 h-4 w-4" />
                        Retirer des amis
                      </>
                    ) : friendRequestSent ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Demande envoyée
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Ajouter en ami
                      </>
                    )}
                  </Button>
                )}
                
                <div className="flex items-center gap-2">
                  <RatingStars
                    rating={userRating}
                    onRatingChange={handleRatingChange}
                    readonly={!currentUserId || currentUserId === userData?.id}
                  />
                </div>
                
                <ReportUserButton username={profileData?.username} />
              </div>
            </div>
            
            <div className="p-6">
              <Tabs defaultValue="profile">
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">Profil</TabsTrigger>
                  <TabsTrigger value="games">Parties</TabsTrigger>
                  <TabsTrigger value="stats">Statistiques</TabsTrigger>
                  <TabsTrigger value="equipment">Équipement</TabsTrigger>
                  <TabsTrigger value="badges">Badges</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <ProfileInfo 
                    user={userData} 
                    profileData={profileData}
                    updateLocation={updateLocation}
                    handleNavigateToTeam={handleNavigateToTeam}
                  />
                </TabsContent>
                
                <TabsContent value="games">
                  <ProfileGames 
                    games={userGames} 
                    handleViewGameDetails={(game) => {
                      setSelectedGame(game);
                      setShowGameDialog(true);
                    }} 
                    handleViewAllGames={() => setShowAllGamesDialog(true)} 
                  />
                </TabsContent>
                
                <TabsContent value="stats">
                  <ProfileStats 
                    userStats={userStats}
                    updateUserStats={updateUserStats}
                    fetchProfileData={fetchProfileData}
                  />
                </TabsContent>
                
                <TabsContent value="equipment">
                  <ProfileEquipment 
                    equipment={equipment} 
                    equipmentTypes={equipmentTypes}
                    readOnly={true}
                  />
                </TabsContent>
                
                <TabsContent value="badges">
                  <ProfileBadges 
                    badges={userBadges} 
                    handleViewAllBadges={() => setShowBadgesDialog(true)} 
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <ProfileDialogs 
        selectedGame={selectedGame}
        showGameDialog={showGameDialog}
        setShowGameDialog={setShowGameDialog}
        showAllGamesDialog={showAllGamesDialog}
        setShowAllGamesDialog={setShowAllGamesDialog}
        showBadgesDialog={showBadgesDialog}
        setShowBadgesDialog={setShowBadgesDialog}
        handleNavigateToGame={handleNavigateToGame}
        user={profileData}
      />
    </div>
  );
};

export default UserProfile;
