
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import TeamSettingsTabs from './TeamSettingsTabs';
import TeamSettingsGeneral from './TeamSettingsGeneral';
import TeamSettingsMedia from './TeamSettingsMedia';
import TeamSettingsMembers from './TeamSettingsMembers';
import TeamSettingsDanger from './TeamSettingsDanger';

interface TeamData {
  id: string;
  name: string;
  logo?: string;
  banner?: string;
  description?: string;
  location?: string;
  contact?: string;
  leader_id?: string;
  is_recruiting?: boolean;
  founded?: number; // Changed from string to number to match TeamSettingsGeneral.tsx
  is_association?: boolean;
}

interface TeamSettingsProps {
  team: TeamData;
  isTeamMember: boolean;
  onTeamUpdate?: (updatedTeam: Partial<TeamData>) => void;
}

const TeamSettings = ({ team, isTeamMember, onTeamUpdate }: TeamSettingsProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('general');
  
  // Vérifier si l'utilisateur est le propriétaire de l'équipe
  const isTeamLeader = user?.id === team?.leader_id;
  
  // If the user is not a team member, don't render the component
  if (!isTeamMember) return null;
  
  // Render the settings button for team members
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-6 right-6 bg-black/50 hover:bg-black/70 text-white"
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only">Paramètres de l'équipe</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isTeamLeader ? "Paramètres de l'équipe" : "Gestion de l'équipe"}
          </DialogTitle>
        </DialogHeader>
        
        <TeamSettingsTabs 
          currentTab={currentTab} 
          onTabChange={setCurrentTab} 
        >
          {currentTab === 'general' && (
            <TeamSettingsGeneral 
              team={team} 
              loading={loading}
              setLoading={setLoading}
              onTeamUpdate={onTeamUpdate} 
            />
          )}
          
          {currentTab === 'media' && (
            <TeamSettingsMedia 
              team={team} 
              loading={loading}
              setLoading={setLoading}
              onTeamUpdate={onTeamUpdate} 
            />
          )}
          
          {currentTab === 'members' && (
            <TeamSettingsMembers 
              team={team} 
              loading={loading}
              setLoading={setLoading}
              isTeamLeader={isTeamLeader}
              user={user}
              onClose={() => setOpen(false)}
            />
          )}
          
          {currentTab === 'danger' && (
            <TeamSettingsDanger 
              team={team} 
              loading={loading}
              setLoading={setLoading}
              isTeamLeader={isTeamLeader}
              user={user}
              onClose={() => setOpen(false)}
            />
          )}
        </TeamSettingsTabs>
      </DialogContent>
    </Dialog>
  );
};

export default TeamSettings;
