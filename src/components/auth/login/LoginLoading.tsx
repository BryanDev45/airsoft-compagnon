
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoginLoading = () => {
  return (
    <div className="flex flex-col items-center">
      <Loader2 className="h-12 w-12 animate-spin text-airsoft-red" />
      <p className="mt-4 text-gray-600">Chargement...</p>
    </div>
  );
};

export default LoginLoading;
