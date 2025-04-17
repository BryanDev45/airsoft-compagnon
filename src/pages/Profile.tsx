
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfileData } from '../hooks/useProfileData';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileGames from '../components/profile/ProfileGames';
import ProfileStats from '../components/profile/ProfileStats';
import ProfileEquipment from '../components/profile/ProfileEquipment';
import ProfileBadges from '../components/profile/ProfileBadges';
import ProfileDialogs from '../components/profile/ProfileDialogs';

const Profile = () => {
  const {
    user,
    editing,
    setEditing,
    selectedGame,
    setSelectedGame,
    showGameDialog,
    setShowGameDialog,
    showAllGamesDialog,
    setShowAllGamesDialog,
    showBadgesDialog,
    setShowBadgesDialog,
    equipmentTypes,
    handleViewGameDetails,
    handleViewAllGames,
    handleViewAllBadges,
    handleNavigateToGame,
    handleNavigateToTeam,
    handleLogout
  } = useProfileData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ProfileHeader 
              user={user} 
              isOwnProfile={true}
              setEditing={setEditing} 
            />
            
            <div className="p-6">
              <Tabs defaultValue="profile">
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">Profil</TabsTrigger>
                  <TabsTrigger value="games">Mes parties</TabsTrigger>
                  <TabsTrigger value="stats">Statistiques</TabsTrigger>
                  <TabsTrigger value="equipment">Équipement</TabsTrigger>
                  <TabsTrigger value="badges">Badges</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <ProfileInfo 
                    user={user} 
                    editing={editing} 
                    setEditing={setEditing} 
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

export default Profile;
