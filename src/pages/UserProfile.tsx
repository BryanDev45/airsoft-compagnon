
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
import ProfileFriends from '../components/profile/ProfileFriends';
import ReportUserButton from '../components/profile/ReportUserButton';
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showAllGamesDialog, setShowAllGamesDialog] = useState(false);
  const [showBadgesDialog, setShowBadgesDialog] = useState(false);
  
  const equipmentTypes = ["Réplique principale", "Réplique secondaire", "Protection", "Accessoire"];
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        
        // Récupérer le profil de l'utilisateur
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();
          
        if (profileError) throw profileError;
        if (!profileData) throw new Error('Profil non trouvé');
        
        setProfileData(profileData);
        
        // Récupérer les statistiques de l'utilisateur
        const { data: statsData, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', profileData.id)
          .single();
          
        if (!statsError && statsData) {
          setUserStats(statsData);
        }
        
        // Récupérer l'équipement de l'utilisateur
        const { data: equipmentData, error: equipmentError } = await supabase
          .from('equipment')
          .select('*')
          .eq('user_id', profileData.id);
          
        if (!equipmentError && equipmentData) {
          profileData.equipment = equipmentData;
        }
        
        // Récupérer les parties auxquelles l'utilisateur a participé
        const { data: gamesData, error: gamesError } = await supabase
          .from('game_participants')
          .select(`
            game_id,
            games (*)
          `)
          .eq('user_id', profileData.id)
          .limit(5);
          
        if (!gamesError && gamesData) {
          profileData.games = gamesData.map(g => g.games);
        }
        
        // Récupérer les badges de l'utilisateur
        const { data: badgesData, error: badgesError } = await supabase
          .from('user_badges')
          .select(`
            badge_id,
            date,
            badges (*)
          `)
          .eq('user_id', profileData.id);
          
        if (!badgesError && badgesData) {
          profileData.badges = badgesData.map(b => ({
            ...b.badges,
            date: b.date
          }));
        }
        
        setUserData(profileData);
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

    fetchUserData();
  }, [username]);

  const handleFollowUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentification requise",
          description: "Vous devez être connecté pour suivre un utilisateur",
          variant: "destructive",
        });
        return;
      }
      
      if (isFollowing) {
        // Supprimer l'ami
        await supabase
          .from('friendships')
          .delete()
          .or(`and(user_id.eq.${user.id},friend_id.eq.${profileData.id}),and(user_id.eq.${profileData.id},friend_id.eq.${user.id})`);
          
        setIsFollowing(false);
        toast({
          title: "Suivi supprimé",
          description: `Vous ne suivez plus ${profileData.username}`,
        });
      } else {
        // Ajouter une demande d'ami
        await supabase
          .from('friendships')
          .insert({
            user_id: user.id,
            friend_id: profileData.id,
            status: 'pending'
          });
          
        setIsFollowing(true);
        toast({
          title: "Demande envoyée",
          description: `Demande d'ami envoyée à ${profileData.username}`,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la gestion du suivi:", error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter votre demande",
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
    return false;
  };

  const updateUserStats = async () => {
    return false;
  };
  
  const fetchProfileData = async () => {
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
                      Ne plus suivre
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Suivre
                    </>
                  )}
                </Button>
                
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
                  <TabsTrigger value="friends">Amis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <ProfileInfo 
                    user={userData} 
                    profileData={profileData}
                    updateLocation={updateLocation}
                    handleNavigateToTeam={handleNavigateToTeam}
                    isOwnProfile={false}
                  />
                </TabsContent>
                
                <TabsContent value="games">
                  <ProfileGames 
                    games={profileData.games || []} 
                    handleViewGameDetails={(game) => {
                      setSelectedGame(game);
                      setShowGameDialog(true);
                    }} 
                    handleViewAllGames={() => setShowAllGamesDialog(true)} 
                  />
                </TabsContent>
                
                <TabsContent value="stats">
                  <ProfileStats 
                    userStats={userStats || {}}
                    updateUserStats={updateUserStats}
                    fetchProfileData={fetchProfileData}
                  />
                </TabsContent>
                
                <TabsContent value="equipment">
                  <ProfileEquipment 
                    equipment={profileData.equipment || []} 
                    equipmentTypes={equipmentTypes}
                    readOnly={true}
                  />
                </TabsContent>
                
                <TabsContent value="badges">
                  <ProfileBadges 
                    badges={profileData.badges || []} 
                    handleViewAllBadges={() => setShowBadgesDialog(true)} 
                  />
                </TabsContent>
                
                <TabsContent value="friends">
                  <ProfileFriends 
                    userId={profileData.id}
                    isOwnProfile={false}
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
