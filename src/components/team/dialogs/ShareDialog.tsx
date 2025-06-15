
import React from 'react';
import { Copy, Facebook } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShareDialogProps {
  team: any;
  showShareDialog: boolean;
  setShowShareDialog: (show: boolean) => void;
  handleShareVia: (method: string) => void;
}

const ShareDialog = ({ team, showShareDialog, setShowShareDialog, handleShareVia }: ShareDialogProps) => {
  if (!team) return null;

  const teamUrl = `${window.location.origin}/team/${team.id}`;

  return (
    <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partager l'équipe {team.name}</DialogTitle>
          <DialogDescription>
            Partagez cette équipe avec vos amis via le lien ou les réseaux sociaux.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <div className="grid flex-1 gap-2">
              <label htmlFor="link" className="sr-only">Lien</label>
              <input
                id="link"
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                readOnly
                value={teamUrl}
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleShareVia('copy')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou partager via</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShareVia('facebook')}
            >
              <Facebook className="text-blue-600 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShareVia('twitter')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zm-1.61 19.99h2.136L4.36 2.161H2.125l15.166 19.006z"/>
              </svg>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShareVia('whatsapp')}
            >
              <FaWhatsapp className="text-green-500 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShareVia('email')}
            >
              <MdEmail className="text-gray-500 h-5 w-5" />
            </Button>
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button variant="secondary">
              Fermer
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
