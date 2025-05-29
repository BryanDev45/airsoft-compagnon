
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileGames from '../components/profile/ProfileGames';
import ProfileStats from '../components/profile/ProfileStats';
import ProfileEquipment from '../components/profile/ProfileEquipment';
import ProfileBadges from '../components/profile/ProfileBadges';
import ProfileDialogs from '../components/profile/ProfileDialogs';
import ProfileFriends from '../components/profile/ProfileFriends';
import { useUserProfile } from '../hooks/useUserProfile';
import UserProfileHeader from '../components/profile/UserProfileHeader';
import { toast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  
  const {
    loading,
    userData,
    profileData,
    userStats,
    equipment,
    userGames,
    userBadges,
    isFollowing,
    friendRequestSent,
    userRating,
    userReputation,
    currentUserId,
    isCurrentUserAdmin,
    handleFollowUser,
    handleRatingChange,
    updateLocation,
    updateUserStats,
    fetchProfileData
  } = useUserProfile(username);

  const [selectedGame, setSelectedGame] = useState(null);
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showAllGamesDialog, setShowAllGamesDialog] = useState(false);
  const [showBadgesDialog, setShowBadgesDialog] = useState(false);
  
  const equipmentTypes = ["Réplique principale", "Réplique secondaire", "Protection", "Accessoire"];

  const handleNavigateToGame = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  const handleNavigateToTeam = () => {
    if (profileData?.team_id) {
      navigate(`/team/${profileData.team_id}`);
    }
  };

  // Show banned user warning
  React.useEffect(() => {
    if (userData?.Ban === true) {
      toast({
        title: "Utilisateur banni",
        description: "Ce compte a été banni par un administrateur",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-airsoft-red rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Chargement des données du profil...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Check if the profile is the user's own
  const isOwnProfile = currentUserId === userData?.id;

  // Show a banner if the user is banned
  const BannedUserBanner = () => {
    if (userData?.Ban !== true) return null;
    
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Compte banni</AlertTitle>
        <AlertDescription>
          <div>Ce compte utilisateur a été banni par un administrateur.</div>
          {userData?.ban_reason && (
            <div className="mt-2 font-medium">
              Raison : {userData.ban_reason}
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {userData?.Ban && <BannedUserBanner />}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <UserProfileHeader
              profileData={profileData}
              userData={userData}
              isFollowing={isFollowing}
              friendRequestSent={friendRequestSent}
              currentUserId={currentUserId}
              userRating={userRating}
              userReputation={userReputation}
              handleFollowUser={handleFollowUser}
              handleRatingChange={handleRatingChange}
              isCurrentUserAdmin={isCurrentUserAdmin}
            />
            
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
                    isOwnProfile={isOwnProfile}
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
                    profileData={profileData}
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

                <TabsContent value="friends">
                  <ProfileFriends 
                    userId={userData?.id}
                    isOwnProfile={isOwnProfile}
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
