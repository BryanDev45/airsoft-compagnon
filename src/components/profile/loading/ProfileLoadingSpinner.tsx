
import React from 'react';
import { Loader2 } from 'lucide-react';

const ProfileLoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-airsoft-red" />
        <p className="text-gray-600">Chargement du profil...</p>
      </div>
    </div>
  );
};

export default ProfileLoadingSpinner;
