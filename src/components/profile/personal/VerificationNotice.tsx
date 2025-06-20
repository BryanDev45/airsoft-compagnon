
import React from 'react';

interface VerificationNoticeProps {
  isVerified: boolean;
  isOwnProfile: boolean;
}

const VerificationNotice: React.FC<VerificationNoticeProps> = ({ isVerified, isOwnProfile }) => {
  if (!isVerified || !isOwnProfile) return null;

  return (
    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
      <p className="text-sm text-green-700">
        <span className="font-medium">Profil vérifié :</span> Le nom et prénom ne peuvent plus être modifiés car votre compte est vérifié.
      </p>
    </div>
  );
};

export default VerificationNotice;
