
import React, { useState, useRef } from 'react';
import { Settings, UserPlus, Shield, Mail, Trash2, ImageIcon, Image } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TeamSettingsProps {
  team: any;
}

const TeamSettings = ({ team }: TeamSettingsProps) => {
  const [contactEmail, setContactEmail] = useState(team.contactEmail || "");
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [memberRole, setMemberRole] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

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

  const handleDeleteMember = () => {
    if (!selectedMember) return;
    
    // Simulating API call
    toast({
      title: "Membre supprimé",
      description: `${selectedMember.username} a été retiré de l'équipe`
    });
    
    setShowDeleteDialog(false);
    setSelectedMember(null);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setLogoPreview(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setBannerPreview(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMedia = () => {
    // Simulating API call
    toast({
      title: "Médias mis à jour",
      description: "Les médias de l'équipe ont été mis à jour avec succès"
    });
  };

  return (
    <>
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Paramètres de l'équipe</DialogTitle>
            <DialogDescription>
              Gérez les paramètres et les membres de votre équipe.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="contact">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="members">Membres</TabsTrigger>
              <TabsTrigger value="media">Médias</TabsTrigger>
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
                      <div className="flex items-center justify-between">
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
                        {selectedMember?.id === member.id && !member.isTeamLeader && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
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
            
            <TabsContent value="media" className="py-4 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Logo de l'équipe</h3>
                
                <div className="flex items-center space-x-4">
                  <div className="h-24 w-24 rounded-full border overflow-hidden bg-gray-100 flex items-center justify-center">
                    {logoPreview ? (
                      <img 
                        src={logoPreview} 
                        alt="Nouveau logo" 
                        className="h-full w-full object-cover" 
                      />
                    ) : team.logo ? (
                      <img 
                        src={team.logo} 
                        alt="Logo actuel" 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <Button 
                      variant="outline" 
                      onClick={() => logoInputRef.current?.click()}
                      className="w-full mb-2"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Changer le logo
                    </Button>
                    <Input 
                      type="file" 
                      ref={logoInputRef}
                      className="hidden" 
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                    <p className="text-xs text-gray-500">
                      Format recommandé : carré, minimum 200x200px
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Bannière de l'équipe</h3>
                
                <div className="space-y-4">
                  <div className="h-32 w-full rounded-md border overflow-hidden bg-gray-100 flex items-center justify-center">
                    {bannerPreview ? (
                      <img 
                        src={bannerPreview} 
                        alt="Nouvelle bannière" 
                        className="h-full w-full object-cover" 
                      />
                    ) : team.banner ? (
                      <img 
                        src={team.banner} 
                        alt="Bannière actuelle" 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <Image className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  
                  <div>
                    <Button 
                      variant="outline" 
                      onClick={() => bannerInputRef.current?.click()}
                      className="w-full mb-2"
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Changer la bannière
                    </Button>
                    <Input 
                      type="file" 
                      ref={bannerInputRef}
                      className="hidden" 
                      accept="image/*"
                      onChange={handleBannerChange}
                    />
                    <p className="text-xs text-gray-500">
                      Format recommandé : 1200x300px
                    </p>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={handleSaveMedia}>
                  Enregistrer les médias
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir retirer {selectedMember?.username} de l'équipe ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-700 text-white" 
              onClick={handleDeleteMember}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TeamSettings;
