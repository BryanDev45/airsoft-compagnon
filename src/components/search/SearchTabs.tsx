
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, User, Users, Store, Lock } from 'lucide-react';
import MapSection from '../MapSection';
import StoresMapSection from '../stores/StoresMapSection';
import UserSearchSection from './UserSearchSection';
import TeamSearchSection from './TeamSearchSection';

interface SearchTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
}

const SearchTabs: React.FC<SearchTabsProps> = ({ activeTab, setActiveTab, user }) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
      <TabsList className="mb-8">
        <TabsTrigger value="parties" className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          Parties
        </TabsTrigger>
        <TabsTrigger value="joueurs" className="flex items-center gap-1">
          <User className="h-4 w-4" />
          Joueurs
          {!user && <Lock className="h-3 w-3 ml-1" />}
        </TabsTrigger>
        <TabsTrigger value="equipes" className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          Équipes
          {!user && <Lock className="h-3 w-3 ml-1" />}
        </TabsTrigger>
        <TabsTrigger value="magasins" className="flex items-center gap-1">
          <Store className="h-4 w-4" />
          Magasins
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="parties">
        <MapSection />
      </TabsContent>
      
      <TabsContent value="joueurs">
        <UserSearchSection user={user} />
      </TabsContent>
      
      <TabsContent value="equipes">
        <TeamSearchSection user={user} />
      </TabsContent>
      
      <TabsContent value="magasins">
        <StoresMapSection />
      </TabsContent>
    </Tabs>
  );
};

export default SearchTabs;
