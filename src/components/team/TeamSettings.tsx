
import React, { useState } from 'react';
import { Settings, UserPlus, Shield, Mail } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface TeamSettingsProps {
  team: any;
}

const TeamSettings = ({ team }: TeamSettingsProps) => {
  const [contactEmail, setContactEmail] = useState(team.contactEmail || "");
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [memberRole, setMemberRole] = useState("");

  const handleUpdateContactInfo = () => {
    // Simulating API call
    toast({
      title: "Informations mises à jour",
      description: "L'adresse de contact a été mise à jour avec succès"
    });
  };

  const handleUpdateMemberRole = (memberId: number, newRole: string) => {
    // Simulating API call
    toast({
      title: "Rôle mis à jour",
      description: `Le rôle du membre a été mis à jour avec succès`
    });
    setSelectedMember(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="absolute top-6 right-6"
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only">Paramètres de l'équipe</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Paramètres de l'équipe</DialogTitle>
          <DialogDescription>
            Gérez les paramètres et les membres de votre équipe.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="contact">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="members">Membres</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contact" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email de contact</Label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <Input 
                  id="email" 
                  value={contactEmail} 
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="email@example.com" 
                />
              </div>
              <p className="text-xs text-gray-500">
                Cette adresse sera utilisée pour recevoir les messages via le bouton "Contacter".
              </p>
            </div>
            
            <DialogFooter>
              <Button onClick={handleUpdateContactInfo}>Enregistrer</Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="members" className="py-4">
            <div className="space-y-4">
              <div className="text-sm text-gray-700 mb-2">
                Sélectionnez un membre pour modifier son rôle
              </div>
              
              <div className="max-h-60 overflow-y-auto space-y-2">
                {team.members.map((member: any) => (
                  <div 
                    key={member.id}
                    className={`p-2 rounded-md border ${selectedMember?.id === member.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} cursor-pointer`}
                    onClick={() => {
                      setSelectedMember(member);
                      setMemberRole(member.role);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img 
                          src={member.avatar} 
                          alt={member.username} 
                          className="w-10 h-10 rounded-full"
                        />
                        {member.isTeamLeader && (
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                            <Shield className="h-3 w-3 text-yellow-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{member.username}</div>
                        <div className="text-xs text-gray-500">{member.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedMember && (
                <div className="pt-4 border-t">
                  <div className="text-sm font-medium mb-2">
                    Modifier le rôle de {selectedMember.username}
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="role">Rôle</Label>
                      <Select 
                        value={memberRole} 
                        onValueChange={setMemberRole}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Chef d'équipe">Chef d'équipe</SelectItem>
                          <SelectItem value="Tireur d'élite">Tireur d'élite</SelectItem>
                          <SelectItem value="Support médical">Support médical</SelectItem>
                          <SelectItem value="Éclaireur">Éclaireur</SelectItem>
                          <SelectItem value="Mitrailleur">Mitrailleur</SelectItem>
                          <SelectItem value="Assaut">Assaut</SelectItem>
                          <SelectItem value="Support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setSelectedMember(null)}>
                        Annuler
                      </Button>
                      <Button onClick={() => handleUpdateMemberRole(selectedMember.id, memberRole)}>
                        Enregistrer
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TeamSettings;
