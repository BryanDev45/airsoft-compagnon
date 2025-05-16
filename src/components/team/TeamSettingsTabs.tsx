
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TeamSettingsTabsProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const TeamSettingsTabs = ({ currentTab, onTabChange, children }: TeamSettingsTabsProps) => {
  return (
    <Tabs value={currentTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="general">Général</TabsTrigger>
        <TabsTrigger value="media">Média</TabsTrigger>
        <TabsTrigger value="members">Membres</TabsTrigger>
        <TabsTrigger value="danger">Danger</TabsTrigger>
      </TabsList>
      
      <TabsContent value={currentTab} className="space-y-4 pt-4">
        {children}
      </TabsContent>
    </Tabs>
  );
};

export default TeamSettingsTabs;
