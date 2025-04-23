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
import { UserPlus, UserMinus } from "lucide-react";
import RatingStars from '../components/RatingStars';

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
  const [userRating, setUserRating] = useState(0);
  
  const equipmentTypes = ["Réplique principale", "Réplique secondaire", "Protection", "Accessoire"];
  
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

    if (username) {
      fetchUserData();
    }
  }, [username, navigate]);

  const handleFollowUser = () => {
    setIsFollowing(!isFollowing);
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
    return false;
  };

  const updateUserStats = async () => {
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
                <Button 
                  onClick={handleFollowUser}
                  variant={isFollowing ? "outline" : "default"}
                  className={isFollowing ? "bg-white text-black border-gray-300" : "bg-airsoft-red text-white"}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="mr-2 h-4 w-4" />
                      Retirer des amis
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Ajouter en ami
                    </>
                  )}
                </Button>
                
                <div className="flex items-center gap-2">
                  <RatingStars
                    rating={userRating}
                    onRatingChange={setUserRating}
                  />
                </div>
                
                <ReportUserButton username={profileData.username} />
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
