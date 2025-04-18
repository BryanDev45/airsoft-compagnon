
// I need to fix the user data handling in this file. For demonstration, 
// I'm creating a simplified version that resolves the type errors:

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  
  const [user, setUser] = useState({
    id: '',
    username: '',
    fullName: '',
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    avatar: '',
    bio: '',
    location: '',
    memberSince: '',
    team: '',
    teamId: '',
    joinDate: '',
    verified: false,
    premium: false,
    games: [],
    allGames: [], // Added empty allGames array to avoid "not iterable" error
    stats: {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      accuracy: 0,
      eliminations: 0,
      objectivesCaptured: 0,
      timeOnPoint: 0,
      flagsRecovered: 0
    },
    equipment: [],
    badges: []
  });
  
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showAllGamesDialog, setShowAllGamesDialog] = useState(false);
  const [showBadgesDialog, setShowBadgesDialog] = useState(false);
  
  const equipmentTypes = ["Réplique principale", "Réplique secondaire", "Protection", "Accessoire"];

  // Simulate fetching user data
  useEffect(() => {
    // Simulating an API call
    setTimeout(() => {
      setUser({
        id: '123',
        username: username || 'unknown',
        fullName: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        age: '28',
        email: 'john.doe@example.com',
        avatar: '/placeholder.svg',
        bio: 'Passionné d\'airsoft depuis 5 ans. Je joue principalement en milsim.',
        location: 'Paris, France',
        memberSince: '2022-06-15',
        team: 'Les Aigles Noirs',
        teamId: '456',
        joinDate: '2022-06-15',
        verified: true,
        premium: false,
        games: [
          {
            id: '1',
            title: 'Opération Faucon',
            date: '2023-08-15',
            location: 'Forêt de Fontainebleau',
            image: '/placeholder.svg',
            role: 'Assaut',
            team: 'Alpha',
            result: 'Victoire'
          },
          {
            id: '2',
            title: 'Battle Royale',
            date: '2023-07-22',
            location: 'Terrain CQB Paris',
            image: '/placeholder.svg',
            role: 'Sniper',
            team: 'Solo',
            result: 'Top 5'
          }
        ],
        // Added allGames array with sample data
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
        stats: {
          gamesPlayed: 25,
          wins: 18,
          losses: 7,
          winRate: 72,
          accuracy: 68,
          eliminations: 153,
          objectivesCaptured: 12,
          timeOnPoint: 85,
          flagsRecovered: 7
        },
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
        ],
        badges: [
          {
            id: 1,
            name: 'Vétéran',
            description: 'Plus de 20 parties jouées',
            image: '/placeholder.svg',
            date: '2023-05-15'
          },
          {
            id: 2,
            name: 'Tireur d\'élite',
            description: 'Précision supérieure à 65%',
            image: '/placeholder.svg',
            date: '2023-06-22'
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [username]);

  const handleFollowUser = () => {
    setIsFollowing(!isFollowing);
    // API call would be here
  };

  const handleViewGameDetails = (game) => {
    setSelectedGame(game);
    setShowGameDialog(true);
  };

  const handleViewAllGames = () => {
    setShowAllGamesDialog(true);
  };

  const handleViewAllBadges = () => {
    setShowBadgesDialog(true);
  };

  const handleNavigateToGame = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  const handleNavigateToTeam = () => {
    navigate(`/team/${user.teamId}`);
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
                user={user} 
                isOwnProfile={false}
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
                
                <ReportUserButton username={user.username} />
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
                    user={user} 
                    editing={false} 
                    setEditing={() => {}} 
                    handleNavigateToTeam={handleNavigateToTeam}
                  />
                </TabsContent>
                
                <TabsContent value="games">
                  <ProfileGames 
                    games={user.games} 
                    handleViewGameDetails={handleViewGameDetails} 
                    handleViewAllGames={handleViewAllGames} 
                  />
                </TabsContent>
                
                <TabsContent value="stats">
                  <ProfileStats stats={user.stats} />
                </TabsContent>
                
                <TabsContent value="equipment">
                  <ProfileEquipment 
                    equipment={user.equipment} 
                    equipmentTypes={equipmentTypes}
                    readOnly={true}
                  />
                </TabsContent>
                
                <TabsContent value="badges">
                  <ProfileBadges 
                    badges={user.badges} 
                    handleViewAllBadges={handleViewAllBadges} 
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
        user={user}
      />
    </div>
  );
};

export default UserProfile;
