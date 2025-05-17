import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Facebook, Twitter, Mail, Copy, BadgeCheck } from "lucide-react";

interface TeamMember {
  id: string;
  username?: string;
  avatar?: string;
  role?: string;
  joinedTeam?: string;
  verified?: boolean;
  specialty?: string;
}

interface TeamData {
  id: string;
  name: string;
  logo?: string;
  contactEmail?: string;
  founded?: number; // Updated from string to number
}

interface TeamDialogsProps {
  team: TeamData;
  selectedMember: TeamMember | null;
  showMemberDialog: boolean;
  setShowMemberDialog: (show: boolean) => void;
  showContactDialog: boolean;
  setShowContactDialog: (show: boolean) => void;
  showShareDialog: boolean;
  setShowShareDialog: (show: boolean) => void;
  contactMessage: string;
  setContactMessage: (message: string) => void;
  contactSubject: string;
  setContactSubject: (subject: string) => void;
  handleSendMessage: () => void;
  handleShareVia: (method: string) => void;
}

const TeamDialogs = ({
  team,
  selectedMember,
  showMemberDialog,
  setShowMemberDialog,
  showContactDialog,
  setShowContactDialog,
  showShareDialog,
  setShowShareDialog,
  contactMessage,
  setContactMessage,
  contactSubject,
  setContactSubject,
  handleSendMessage,
  handleShareVia
}: TeamDialogsProps) => {
  return (
    <>
      {/* Member Dialog */}
      <Dialog open={showMemberDialog} onOpenChange={setShowMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {selectedMember?.username}
              {selectedMember?.verified && (
                <BadgeCheck className="h-4 w-4 ml-1 text-blue-500" />
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={selectedMember?.avatar} alt={selectedMember?.username} />
              <AvatarFallback>{selectedMember?.username?.substring(0, 2)}</AvatarFallback>
            </Avatar>
            
            <div className="text-center">
              <p className="text-gray-500">{selectedMember?.role}</p>
              <p className="text-sm text-gray-400">Membre depuis {selectedMember?.joinedTeam}</p>
            </div>
            
            <div className="w-full border-t pt-4 mt-2">
              <h4 className="font-medium mb-2">Spécialité</h4>
              <p>{selectedMember?.specialty || "Non spécifié"}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contacter {team.name}</DialogTitle>
            <DialogDescription>
              Envoyez un message à l'équipe. Ils vous répondront par email.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">Sujet</label>
              <Input
                id="subject"
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                placeholder="Sujet de votre message"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
              <Textarea
                id="message"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Votre message"
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleSendMessage}>Envoyer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Partager {team.name}</DialogTitle>
            <DialogDescription>
              Partagez cette équipe avec vos amis
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => handleShareVia('facebook')}>
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </Button>
            <Button variant="outline" onClick={() => handleShareVia('twitter')}>
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button variant="outline" onClick={() => handleShareVia('email')}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="outline" onClick={() => handleShareVia('copy')}>
              <Copy className="h-4 w-4 mr-2" />
              Copier le lien
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeamDialogs;
