
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SocialRegistrationTab from '../SocialRegistrationTab';
import EmailRegistrationTab from '../EmailRegistrationTab';

interface RegisterTabsProps {
  isAnyLoading: boolean;
}

const RegisterTabs = ({ isAnyLoading }: RegisterTabsProps) => {
  return (
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
  );
};

export default RegisterTabs;
