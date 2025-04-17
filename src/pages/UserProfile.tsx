
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileGames from '../components/profile/ProfileGames';
import ProfileStats from '../components/profile/ProfileStats';
import ProfileEquipment from '../components/profile/ProfileEquipment';
import ProfileBadges from '../components/profile/ProfileBadges';
import ProfileDialogs from '../components/profile/ProfileDialogs';
import { mockUserData } from '../utils/mockData';
import { toast } from "@/components/ui/use-toast";

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  
  // In a real app, we would fetch user data based on username
  // For now, we'll use mock data
  const [user, setUser] = useState(mockUserData);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showAllGamesDialog, setShowAllGamesDialog] = useState(false);
  const [showBadgesDialog, setShowBadgesDialog] = useState(false);

  useEffect(() => {
    // Simulate API request
    setIsLoading(true);
    
    // In a real application, fetch user data here
    setTimeout(() => {
      // For demo purposes, we're using the mock data
      // This would be replaced with actual API call in a real app
      setUser({
        ...mockUserData,
        username: username || mockUserData.username,
        firstname: "Jean", // Added first name
        lastname: "Dupont", // Added last name
        age: 28, // Added age
      });
      setIsLoading(false);
    }, 500);
  }, [username]);

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
    setShowGameDialog(false);
    setShowAllGamesDialog(false);
    navigate(`/game/${gameId}`);
  };

  const handleNavigateToTeam = () => {
    navigate(`/team/${user.teamId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-300 rounded-full mb-4"></div>
            <div className="h-6 w-48 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 w-64 bg-gray-300 rounded"></div>
          </div>
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
            <ProfileHeader 
              user={user} 
              isOwnProfile={false}
            />
            
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Nom d'utilisateur</p>
                      <p className="font-medium">{user.username}</p>
                    </div>
                    {user.firstname && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Prénom</p>
                        <p className="font-medium">{user.firstname}</p>
                      </div>
                    )}
                    {user.lastname && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Nom</p>
                        <p className="font-medium">{user.lastname}</p>
                      </div>
                    )}
                    {user.age && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Âge</p>
                        <p className="font-medium">{user.age} ans</p>
                      </div>
                    )}
                    {user.team && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Équipe</p>
                        <p 
                          className="font-medium text-airsoft-red hover:underline cursor-pointer" 
                          onClick={handleNavigateToTeam}
                        >
                          {user.team}
                        </p>
                      </div>
                    )}
                    {user.location && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Localisation</p>
                        <p className="font-medium">{user.location}</p>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Date d'inscription</p>
                      <p className="font-medium">{user.joinDate}</p>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <p className="text-sm text-gray-500">Biographie</p>
                      <p className="font-medium">{user.bio}</p>
                    </div>
                  </div>
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
                    equipmentTypes={[]}
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
