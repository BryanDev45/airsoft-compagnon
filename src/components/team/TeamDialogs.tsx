
import React from 'react';
import { Send, Share, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface TeamDialogsProps {
  team: any;
  selectedMember: any;
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {selectedMember?.username}
              {selectedMember?.verified && (
                <img 
                  src="/lovable-uploads/381c6357-0426-45d3-8262-7b1be5c1bc96.png" 
                  alt="Vérifié" 
                  className="w-5 h-5 ml-1"
                />
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={selectedMember?.avatar} 
                alt={selectedMember?.username} 
                className="w-20 h-20 rounded-full object-cover"
              />
              {selectedMember?.isTeamLeader && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                  <img 
                    src="/lovable-uploads/3c025802-3046-4c34-ae5e-2328e941b479.png" 
                    alt="Team Leader" 
                    className="w-6 h-6"
                  />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold">{selectedMember?.username}</h3>
              <p className="text-sm text-gray-500">{selectedMember?.role}</p>
              <p className="text-xs text-gray-400">Membre depuis {selectedMember?.joinedTeam}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Spécialité</h4>
              <p className="text-sm">{selectedMember?.specialty}</p>
            </div>
            {selectedMember?.isTeamLeader && (
              <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <Shield className="text-yellow-600" size={16} />
                  <p className="text-sm font-medium text-yellow-800">Chef d'équipe</p>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Ce joueur est le fondateur et leader de l'équipe
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowMemberDialog(false)}
            >
              Fermer
            </Button>
            <Button 
              className="bg-airsoft-red hover:bg-red-700"
              asChild
            >
              <Link to={`/profile`}>Voir profil complet</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
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

      {/* Share Dialog */}
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
              <img src="/lovable-uploads/1cc60b94-2b6c-4e0e-9ab8-1bd1e8cb1098.png" alt="Facebook" className="w-8 h-8 mb-2" />
              <span>Facebook</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center py-6"
              onClick={() => handleShareVia('twitter')}
            >
              <img src="/lovable-uploads/84404d08-fa37-4317-80e0-d607d3676fd5.png" alt="Twitter" className="w-8 h-8 mb-2" />
              <span>Twitter</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center py-6"
              onClick={() => handleShareVia('whatsapp')}
            >
              <img src="/lovable-uploads/e3177716-6012-4386-a9b2-607ab6f838b0.png" alt="WhatsApp" className="w-8 h-8 mb-2" />
              <span>WhatsApp</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center py-6"
              onClick={() => handleShareVia('email')}
            >
              <img src="/lovable-uploads/c242d3b0-8906-4f00-9b3b-fc251f703e4b.png" alt="Email" className="w-8 h-8 mb-2" />
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
    </>
  );
};

export default TeamDialogs;
