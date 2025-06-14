
import React from 'react';

const VerificationDescription = () => {
  return (
    <>
      <p className="text-sm text-gray-500">
        La vérification de compte permet de garantir votre identité et d'obtenir un badge de vérification sur votre profil. Pour être vérifié, nous avons besoin de votre carte d'identité et d'une photo de votre visage.
      </p>
      
      <p className="text-xs text-gray-500 mt-4">
        Vos documents d'identité et votre photo seront traités et supprimés de nos serveurs après vérification. Ils ne seront jamais partagés avec des tiers.
      </p>
    </>
  );
};

export default VerificationDescription;
