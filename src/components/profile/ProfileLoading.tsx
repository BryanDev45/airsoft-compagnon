
import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

const ProfileLoading = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Chargement du profil...</div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileLoading;
