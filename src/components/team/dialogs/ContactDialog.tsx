
import React from 'react';
import { Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ContactDialogProps {
  team: any;
  showContactDialog: boolean;
  setShowContactDialog: (show: boolean) => void;
  contactMessage: string;
  setContactMessage: (message: string) => void;
  contactSubject: string;
  setContactSubject: (subject: string) => void;
  handleSendMessage: () => void;
}

const ContactDialog = ({
  team,
  showContactDialog,
  setShowContactDialog,
  contactMessage,
  setContactMessage,
  contactSubject,
  setContactSubject,
  handleSendMessage
}: ContactDialogProps) => {
  return (
    <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contacter {team.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Sujet
            </label>
            <Input 
              id="subject" 
              value={contactSubject} 
              onChange={(e) => setContactSubject(e.target.value)} 
              placeholder="Entrez le sujet de votre message" 
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <Textarea 
              id="message" 
              value={contactMessage} 
              onChange={(e) => setContactMessage(e.target.value)} 
              placeholder="Écrivez votre message ici..." 
              rows={6}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowContactDialog(false)}
          >
            Annuler
          </Button>
          <Button
            className="bg-airsoft-red hover:bg-red-700 text-white flex gap-2"
            onClick={handleSendMessage}
          >
            <Send size={16} />
            Envoyer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
