
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useUserProfile } from '../hooks/useUserProfile';
import UserProfileHeader from '../components/profile/UserProfileHeader';
import UserProfileBanner from '../components/profile/UserProfileBanner';
import UserProfileContent from '../components/profile/UserProfileContent';

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
