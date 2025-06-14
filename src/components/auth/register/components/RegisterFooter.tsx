
import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

const RegisterFooter = () => {
  return (
    <div className="mt-6">
      <Separator className="my-4" />
      <p className="text-center text-sm">
        Vous avez déjà un compte ?{' '}
        <Link to="/login" className="font-medium text-airsoft-red hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
};

export default RegisterFooter;
