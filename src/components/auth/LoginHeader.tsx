
import React from 'react';
import { Link } from 'react-router-dom';

const LoginHeader = () => {
  return (
    <div className="text-center">
      <div className="flex justify-center">
        <img src="/lovable-uploads/5c383bd0-1652-45d0-8623-3f4ef3653ec8.png" alt="Airsoft Compagnon Logo" className="h-24 mb-4" />
      </div>
      <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Connexion</h2>
      <p className="mt-2 text-sm text-gray-600">
        Ou{' '}
        <Link to="/register" className="font-medium text-airsoft-red hover:text-red-500">
          créez un compte
        </Link>
      </p>
    </div>
  );
};

export default LoginHeader;
