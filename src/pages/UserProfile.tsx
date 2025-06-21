
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useUserProfile } from '../hooks/useUserProfile';
import UserProfileHeader from '../components/profile/UserProfileHeader';
import UserProfileBanner from '../components/profile/UserProfileBanner';
import UserProfileContent from '../components/profile/UserProfileContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useDeleteUserWarning } from '@/hooks/admin/useUserWarnings';
import { Button } from '@/components/ui/button';
import { useUnifiedDialogs } from '@/hooks/profile/useUnifiedDialogs';
import ProfileDialogs from '../components/profile/ProfileDialogs';

const UserProfile = () => {
  const { username } = useParams();
  
  console.log('UserProfile component: username from params:', username);
  
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
    userWarnings,
    handleFollowUser,
    handleRatingChange,
    updateLocation,
    updateUserStats,
    fetchProfileData
  } = useUserProfile(username);

  console.log('UserProfile component: hook data:', {
    loading,
    userData,
    profileData,
    userStats,
    currentUserId,
    isCurrentUserAdmin,
  });

  const { mutate: deleteWarning, isPending: isDeletingWarning } = useDeleteUserWarning();

  // Hook unifié pour tous les dialogs
  const dialogStates = useUnifiedDialogs();

  const handleDeleteWarning = (warningId: string) => {
    deleteWarning(warningId);
  };

  if (loading) {
    console.log('UserProfile component: Showing loading state');
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

  if (!userData && !loading) {
    console.log('UserProfile component: No user data found');
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Utilisateur non trouvé</h1>
            <p className="text-gray-600">Ce profil n'existe pas ou a été supprimé.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isOwnProfile = currentUserId === userData?.id;

  console.log('UserProfile component: Rendering profile for user:', userData?.username);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <UserProfileBanner userData={userData} />

          {isCurrentUserAdmin && userWarnings && userWarnings.length > 0 && (
            <Card className="my-6 border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle />
                  Avertissements de l'utilisateur
                </CardTitle>
                <CardDescription className="text-orange-700">
                  Cette section est visible uniquement par les administrateurs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userWarnings.map((warning) => (
                  <div key={warning.id} className="p-3 border-t border-orange-200 first:border-t-0 flex justify-between items-start gap-4">
                    <div className="flex-grow">
                      <p><strong>Raison :</strong> {warning.reason}</p>
                      {warning.context && <p className="text-sm text-gray-600"><strong>Contexte :</strong> {warning.context}</p>}
                      <p className="text-xs text-gray-500 mt-1">
                        Donné le {format(new Date(warning.created_at), 'd MMMM yyyy à HH:mm', { locale: fr })}
                        {warning.admin_profile ? ` par ${warning.admin_profile.username}` : ''}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteWarning(warning.id)}
                      disabled={isDeletingWarning}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                      aria-label="Supprimer l'avertissement"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

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
            
            <UserProfileContent
              userData={userData}
              profileData={profileData}
              userStats={userStats}
              equipment={equipment}
              userGames={userGames}
              userBadges={userBadges}
              updateLocation={updateLocation}
              updateUserStats={updateUserStats}
              fetchProfileData={fetchProfileData}
              isOwnProfile={isOwnProfile}
              handleViewGameDetails={dialogStates.showGameDetails}
              handleViewAllGames={dialogStates.openAllGamesDialog}
              handleViewAllBadges={dialogStates.openBadgesDialog}
            />
          </div>
        </div>
      </main>
      <Footer />
      
      <ProfileDialogs 
        selectedGame={dialogStates.selectedGame}
        showGameDialog={dialogStates.showGameDialog}
        setShowGameDialog={dialogStates.setShowGameDialog}
        showAllGamesDialog={dialogStates.showAllGamesDialog}
        setShowAllGamesDialog={dialogStates.setShowAllGamesDialog}
        showBadgesDialog={dialogStates.showBadgesDialog}
        setShowBadgesDialog={dialogStates.setShowBadgesDialog}
        user={profileData}
        userGames={userGames}
        onGameClick={dialogStates.handleGameClickInAllGamesDialog}
      />
    </div>
  );
};

export default UserProfile;
