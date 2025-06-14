
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import RegisterHeader from './RegisterHeader';
import SocialRegistrationTab from './SocialRegistrationTab';
import EmailRegistrationTab from './EmailRegistrationTab';

const RegisterContainer = () => {
  const { loading: authLoading } = useAuth();
  const [socialLoading, setSocialLoading] = useState(false);

  const isAnyLoading = authLoading || socialLoading;

  return (
    <div className="w-full max-w-md">
      <RegisterHeader />

      <div className="mt-8">
        <div className="bg-white py-8 px-6 shadow rounded-lg border-2 border-airsoft-red">
          <Tabs defaultValue="social" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>
            
            <TabsContent value="social">
              <SocialRegistrationTab />
            </TabsContent>
            
            <TabsContent value="email">
              <EmailRegistrationTab isAnyLoading={isAnyLoading} />
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <Separator className="my-4" />
            <p className="text-center text-sm">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="font-medium text-airsoft-red hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterContainer;
