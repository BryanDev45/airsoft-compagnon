import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import TeamSettingsTabs from './TeamSettingsTabs';
import TeamSettingsGeneral from './TeamSettingsGeneral';
import TeamSettingsMedia from './TeamSettingsMedia';
import TeamSettingsMembers from './TeamSettingsMembers';
import TeamSettingsDanger from './TeamSettingsDanger';
import { TeamData } from '@/types/team';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface TeamSettingsProps {
  team: TeamData;
  isTeamMember: boolean;
  onTeamUpdate?: (updatedTeam: Partial<TeamData>) => void;
}

const TeamSettings = ({
  team,
  isTeamMember,
  onTeamUpdate
}: TeamSettingsProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('general');
  const isMobile = useIsMobile();

  // Vérifier si l'utilisateur est le propriétaire de l'équipe ou admin
  const isTeamLeader = user?.id === team?.leader_id;
  const currentUserMember = team.members?.find(member => member.id === user?.id);
  const isTeamAdmin = isTeamLeader || currentUserMember?.role === 'Admin';

  // If the user is not a team member, don't render the component
  if (!isTeamMember) return null;

  const trigger = (
    <Button variant="ghost" size="icon" className="absolute top-6 right-6 text-white my-[60px] bg-airsoft-red">
      <Settings className="h-4 w-4" />
      <span className="sr-only">Paramètres de l'équipe</span>
    </Button>
  );

  const content = (
    <TeamSettingsTabs currentTab={currentTab} onTabChange={setCurrentTab}>
      {currentTab === 'general' && <TeamSettingsGeneral team={team} loading={loading} setLoading={setLoading} onTeamUpdate={onTeamUpdate} isTeamAdmin={isTeamAdmin} />}
      {currentTab === 'media' && <TeamSettingsMedia team={team} loading={loading} setLoading={setLoading} onTeamUpdate={onTeamUpdate} isTeamAdmin={isTeamAdmin} />}
      {currentTab === 'members' && <TeamSettingsMembers team={team} loading={loading} setLoading={setLoading} isTeamAdmin={isTeamAdmin} user={user} onClose={() => setOpen(false)} onTeamUpdate={onTeamUpdate as () => void} />}
      {currentTab === 'danger' && <TeamSettingsDanger team={team} loading={loading} setLoading={setLoading} isTeamLeader={isTeamAdmin} user={user} onClose={() => setOpen(false)} />}
    </TeamSettingsTabs>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent side="right" className="w-[95vw] max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {isTeamLeader ? "Paramètres de l'équipe" : "Gestion de l'équipe"}
            </SheetTitle>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  // Render the settings button for team members
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={cn(
        "max-h-[90vh] overflow-y-auto",
        currentTab === 'members' ? "sm:max-w-4xl" : "sm:max-w-2xl"
      )}>
        <DialogHeader>
          <DialogTitle>
            {isTeamLeader ? "Paramètres de l'équipe" : "Gestion de l'équipe"}
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
export default TeamSettings;
