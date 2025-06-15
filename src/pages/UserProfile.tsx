import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useUserProfile } from '../hooks/useUserProfile';
import UserProfileHeader from '../components/profile/UserProfileHeader';
import UserProfileBanner from '../components/profile/UserProfileBanner';
import UserProfileContent from '../components/profile/UserProfileContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const UserProfile = () => {
  const { username } = useParams();
  
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

  const isOwnProfile = currentUserId === userData?.id;

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
                  <div key={warning.id} className="p-3 border-t border-orange-200 first:border-t-0">
                    <p><strong>Raison :</strong> {warning.reason}</p>
                    {warning.context && <p className="text-sm text-gray-600"><strong>Contexte :</strong> {warning.context}</p>}
                    <p className="text-xs text-gray-500 mt-1">
                      Donné le {format(new Date(warning.created_at), 'd MMMM yyyy à HH:mm', { locale: fr })}
                      {warning.admin_profile ? ` par ${warning.admin_profile.username}` : ''}
                    </p>
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
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
