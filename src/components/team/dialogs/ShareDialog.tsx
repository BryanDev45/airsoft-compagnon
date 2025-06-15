
import React from 'react';
import { Share, Facebook, Twitter } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShareDialogProps {
  team: any;
  showShareDialog: boolean;
  setShowShareDialog: (show: boolean) => void;
  handleShareVia: (method: string) => void;
}

const ShareDialog = ({ team, showShareDialog, setShowShareDialog, handleShareVia }: ShareDialogProps) => {
  return (
    <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partager {team.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="flex flex-col items-center py-6"
            onClick={() => handleShareVia('facebook')}
          >
            <Facebook className="w-8 h-8 mb-2 text-blue-600" />
            <span>Facebook</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center py-6"
            onClick={() => handleShareVia('twitter')}
          >
            <Twitter className="w-8 h-8 mb-2 text-blue-400" />
            <span>Twitter</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center py-6"
            onClick={() => handleShareVia('whatsapp')}
          >
            <FaWhatsapp className="w-8 h-8 mb-2 text-green-500" />
            <span>WhatsApp</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center py-6"
            onClick={() => handleShareVia('email')}
          >
            <MdEmail className="w-8 h-8 mb-2 text-gray-500" />
            <span>Email</span>
          </Button>
        </div>
        <div className="mt-4">
          <Button 
            className="w-full flex items-center justify-center gap-2 bg-airsoft-red hover:bg-red-700 text-white"
            onClick={() => handleShareVia('copy')}
          >
            <Share size={16} />
            Copier le lien
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
