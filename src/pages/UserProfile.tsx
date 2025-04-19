
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
  
  // Récupération des données de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Pour la démonstration, nous utilisons des données statiques
        // Dans un cas réel, vous feriez une requête à Supabase ici
        const mockUserData = {
          id: '123',
          username: username || 'unknown',
          games: [
            {
              id: '1',
              title: 'Opération Faucon',
              date: '2023-08-15',
              location: 'Forêt de Fontainebleau',
              image: '/placeholder.svg',
              role: 'Assaut',
              team: 'Alpha',
              result: 'Victoire',
              status: 'Terminé'
            },
            {
              id: '2',
              title: 'Battle Royale',
              date: '2023-07-22',
              location: 'Terrain CQB Paris',
              image: '/placeholder.svg',
              role: 'Sniper',
              team: 'Solo',
              result: 'Top 5',
              status: 'Terminé'
            }
          ],
          allGames: [
            {
              id: '3',
              title: 'Opération Tempête',
              date: '2023-06-10',
              location: 'Terrain militaire Lyon',
              image: '/placeholder.svg',
              role: 'Support',
              team: 'Bravo',
              status: 'Terminé',
              result: 'Victoire'
            }
          ],
          badges: [
            {
              id: 1,
              name: 'Vétéran',
              description: 'Plus de 20 parties jouées',
              image: '/placeholder.svg',
              icon: '/placeholder.svg',
              date: '2023-05-15',
              backgroundColor: '#f8f9fa',
              borderColor: '#e9ecef'
            },
            {
              id: 2,
              name: 'Tireur d\'élite',
              description: 'Précision supérieure à 65%',
              image: '/placeholder.svg',
              icon: '/placeholder.svg',
              date: '2023-06-22',
              backgroundColor: '#f8f9fa',
              borderColor: '#e9ecef'
            }
          ],
          equipment: [
            {
              id: 1,
              type: 'Réplique principale',
              brand: 'G&G',
              power: '350 FPS',
              description: 'M4 avec rail keymod et grip vertical',
              image: '/placeholder.svg'
            },
            {
              id: 2,
              type: 'Réplique secondaire',
              brand: 'WE',
              power: '300 FPS',
              description: 'Glock 17',
              image: '/placeholder.svg'
            }
          ]
        };

        const mockProfileData = {
          id: '123',
          username: username || 'unknown',
          avatar: '/placeholder.svg',
          bio: 'Passionné d\'airsoft depuis 5 ans. Je joue principalement en milsim.',
          location: 'Paris, France',
          firstname: 'John',
          lastname: 'Doe',
          age: '28',
          team: 'Les Aigles Noirs',
          team_id: '456',
          join_date: '2022-06-15',
          verified: true,
          premium: false,
          reputation: 4.5,
          badges: mockUserData.badges,
          games: mockUserData.games,
          allGames: mockUserData.allGames,
          equipment: mockUserData.equipment
        };

        const mockUserStats = {
          user_id: '123',
          games_played: 25,
          preferred_game_type: 'Milsim',
          favorite_role: 'Sniper',
          win_rate: '72%',
          accuracy: '68%',
          reputation: 8,
          level: 'Confirmé',
          time_played: '85h',
          objectives_completed: 12,
          flags_captured: 7,
          tactical_awareness: 'Bon'
        };

        setUserData(mockUserData);
        setProfileData(mockProfileData);
        setUserStats(mockUserStats);
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

  const handleFollowUser = () => {
    setIsFollowing(!isFollowing);
    // Dans un cas réel, vous feriez une requête à Supabase ici
  };

  const handleNavigateToGame = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  const handleNavigateToTeam = () => {
    if (profileData?.team_id) {
      navigate(`/team/${profileData.team_id}`);
    }
  };

  // Placeholder functions for ProfileHeader props
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
    // Cette fonction est un placeholder pour assurer la compatibilité avec ProfileInfo
    // Dans le profil d'un autre utilisateur, nous ne permettons pas la modification
  };

  const updateUserStats = async () => {
    // Cette fonction est un placeholder pour assurer la compatibilité avec ProfileStats
    // Dans le profil d'un autre utilisateur, nous ne permettons pas la modification
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
                    games={profileData.games} 
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
                  />
                </TabsContent>
                
                <TabsContent value="equipment">
                  <ProfileEquipment 
                    equipment={profileData.equipment} 
                    equipmentTypes={equipmentTypes}
                    readOnly={true}
                  />
                </TabsContent>
                
                <TabsContent value="badges">
                  <ProfileBadges 
                    badges={profileData.badges} 
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
