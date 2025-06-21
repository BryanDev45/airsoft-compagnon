
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { useIsMobile } from '@/hooks/use-mobile';
import GameDetailsContent from './GameDetailsContent';
import GameDetailsActions from './GameDetailsActions';

interface GameDetailsDialogProps {
  selectedGame: any;
  showGameDialog: boolean;
  setShowGameDialog: (show: boolean) => void;
}

const GameDetailsDialog: React.FC<GameDetailsDialogProps> = ({
  selectedGame,
  showGameDialog,
  setShowGameDialog
}) => {
  const isMobile = useIsMobile();

  console.log("🎮 GAME DIALOG - Selected game in dialog:", selectedGame);

  if (!selectedGame) {
    return null;
  }

  const DetailsWrapper = () => (
    <>
      <GameDetailsContent selectedGame={selectedGame} />
      <GameDetailsActions 
        selectedGame={selectedGame} 
        setShowGameDialog={setShowGameDialog} 
      />
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={showGameDialog} onOpenChange={setShowGameDialog}>
        <DrawerContent className="p-4">
          <DrawerHeader className="p-0 text-left mb-4">
            <DrawerTitle className="text-xl font-bold text-airsoft-dark">{selectedGame.title}</DrawerTitle>
            <DrawerDescription className="text-gray-600">
              Détails de la partie
            </DrawerDescription>
          </DrawerHeader>
          <DetailsWrapper />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={showGameDialog} onOpenChange={setShowGameDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-airsoft-dark">{selectedGame.title}</DialogTitle>
          <DialogDescription className="text-gray-600">
            Détails de la partie
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <DetailsWrapper />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameDetailsDialog;
