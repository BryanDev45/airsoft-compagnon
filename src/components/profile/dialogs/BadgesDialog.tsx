
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { useAllBadges } from '@/hooks/badges/useAllBadges';
import { useUserBadges } from '@/hooks/user-profile/useUserBadges';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BadgesDialogProps {
  showBadgesDialog: boolean;
  setShowBadgesDialog: (show: boolean) => void;
  user: any;
}

const BadgesContent = ({ user }: { user: any }) => {
  const {
    data: allBadges,
    isLoading: isLoadingAll
  } = useAllBadges();
  const {
    userBadges,
    loading: isLoadingUserBadges
  } = useUserBadges(user?.id);
  const isLoading = isLoadingAll || isLoadingUserBadges;
  const userBadgeIds = React.useMemo(() => userBadges.map(b => b.id), [userBadges]);

  const badgesToDisplay = React.useMemo(() => {
    return allBadges?.map(badge => {
      const isUnlocked = userBadgeIds.includes(badge.id);
      const displayIcon = isUnlocked ? badge.icon : badge.locked_icon || badge.icon;
      const applyGrayscale = !isUnlocked && !badge.locked_icon;
      return {
        ...badge,
        isUnlocked,
        displayIcon,
        applyGrayscale
      };
    });
  }, [allBadges, userBadgeIds]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <Loader2 className="h-8 w-8 animate-spin text-airsoft-red" />
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
      {badgesToDisplay?.map(badge => (
        <div 
          key={badge.id} 
          className="border rounded-lg p-4 flex flex-col items-center text-center transition-all"
          style={{
            backgroundColor: badge.isUnlocked ? badge.background_color : '#f8fafc',
            borderColor: badge.isUnlocked ? badge.border_color : '#e2e8f0'
          }}
        >
          <div className="relative w-20 h-20 mb-3">
            <img 
              src={badge.displayIcon} 
              alt={badge.name} 
              className={`w-full h-full object-contain ${badge.applyGrayscale ? 'grayscale' : ''}`}
            />
          </div>
          <h3 className="font-semibold mb-1 text-sm">{badge.name}</h3>
          <p className="text-xs text-slate-600 flex-grow">{badge.description}</p>
        </div>
      ))}
    </div>
  );
};

const BadgesDialog: React.FC<BadgesDialogProps> = ({
  showBadgesDialog,
  setShowBadgesDialog,
  user
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={showBadgesDialog} onOpenChange={setShowBadgesDialog}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Tous les badges</DrawerTitle>
            <DrawerDescription>
              Voici la liste de tous les badges que vous pouvez obtenir.
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-auto max-h-[70vh] px-4">
            <BadgesContent user={user} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={showBadgesDialog} onOpenChange={setShowBadgesDialog}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Tous les badges disponibles</DialogTitle>
          <DialogDescription>
            Voici la liste de tous les badges que vous pouvez obtenir sur la plateforme. Participez, contribuez et débloquez-les tous !
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow h-[60vh] w-full rounded-md border">
          <div className="p-4">
            <BadgesContent user={user} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BadgesDialog;
