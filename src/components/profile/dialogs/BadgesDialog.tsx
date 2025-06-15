import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAllBadges } from '@/hooks/badges/useAllBadges';
import { useUserBadges } from '@/hooks/user-profile/useUserBadges';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Lock } from 'lucide-react';
interface BadgesDialogProps {
  showBadgesDialog: boolean;
  setShowBadgesDialog: (show: boolean) => void;
  user: any;
}
const BadgesDialog: React.FC<BadgesDialogProps> = ({
  showBadgesDialog,
  setShowBadgesDialog,
  user
}) => {
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
  return <Dialog open={showBadgesDialog} onOpenChange={setShowBadgesDialog}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Tous les badges disponibles</DialogTitle>
          <DialogDescription>
            Voici la liste de tous les badges que vous pouvez obtenir sur la plateforme. Participez, contribuez et débloquez-les tous !
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-hidden pr-2">
          <ScrollArea className="h-full pr-4">
            {isLoading ? <div className="flex justify-center items-center h-full py-20">
                <Loader2 className="h-8 w-8 animate-spin text-airsoft-red" />
              </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                {badgesToDisplay?.map(badge => <div key={badge.id} className="border rounded-lg p-4 flex flex-col items-center text-center transition-all" style={{
              backgroundColor: badge.isUnlocked ? badge.background_color : '#f8fafc',
              borderColor: badge.isUnlocked ? badge.border_color : '#e2e8f0'
            }}>
                    <div className="relative w-24 h-24 mb-3">
                      <img src={badge.displayIcon} alt={badge.name} className={`w-full h-full object-contain ${badge.applyGrayscale ? 'grayscale' : ''}`} />
                      {!badge.isUnlocked}
                    </div>
                    <h3 className="font-semibold mb-1 text-base">{badge.name}</h3>
                    <p className="text-xs text-slate-600 flex-grow">{badge.description}</p>
                  </div>)}
              </div>}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>;
};
export default BadgesDialog;