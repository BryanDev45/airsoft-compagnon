
import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import ProfileLoadingSpinner from './loading/ProfileLoadingSpinner';

const ProfileLoading = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProfileLoadingSpinner />
      </main>
      <Footer />
    </div>
  );
};

export default ProfileLoading;
