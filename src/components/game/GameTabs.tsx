
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GameTabsProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const GameTabs: React.FC<GameTabsProps> = ({ selectedTab, setSelectedTab }) => {
  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full mt-6">
      <TabsList className="w-full flex justify-start border-b overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <TabsTrigger 
          value="details" 
          className={`px-4 py-2 flex-shrink-0 ${selectedTab === 'details' ? 'border-b-2 border-airsoft-red text-airsoft-red' : 'text-muted-foreground'}`}
        >
          Détails
        </TabsTrigger>
        <TabsTrigger 
          value="rules" 
          className={`px-4 py-2 flex-shrink-0 ${selectedTab === 'rules' ? 'border-b-2 border-airsoft-red text-airsoft-red' : 'text-muted-foreground'}`}
        >
          Règles
        </TabsTrigger>
        <TabsTrigger 
          value="equipment" 
          className={`px-4 py-2 flex-shrink-0 ${selectedTab === 'equipment' ? 'border-b-2 border-airsoft-red text-airsoft-red' : 'text-muted-foreground'}`}
        >
          Équipement
        </TabsTrigger>
        <TabsTrigger 
          value="participants" 
          className={`px-4 py-2 flex-shrink-0 ${selectedTab === 'participants' ? 'border-b-2 border-airsoft-red text-airsoft-red' : 'text-muted-foreground'}`}
        >
          Participants
        </TabsTrigger>
        <TabsTrigger 
          value="comments" 
          className={`px-4 py-2 flex-shrink-0 ${selectedTab === 'comments' ? 'border-b-2 border-airsoft-red text-airsoft-red' : 'text-muted-foreground'}`}
        >
          Commentaires
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default GameTabs;
