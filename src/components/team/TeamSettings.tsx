import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Settings, UserPlus, Shield, Mail, Trash2, ImageIcon, Image, LogOut, AlertTriangle, Edit } from 'lucide-react';
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
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Textarea } from "@/components/ui/textarea";

interface TeamSettingsProps {
  team: any;
  onTeamUpdate?: (updatedTeam: any) => void;
}

const TeamSettings = ({ team, onTeamUpdate }: TeamSettingsProps) => {
  const navigate = useNavigate();
  const [contactEmail, setContactEmail] = useState(team.contactEmail || "");
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [memberRole, setMemberRole] = useState("");
  const [showDeleteMemberDialog, setShowDeleteMemberDialog] = useState(false);
  const [showLeaveTeamDialog, setShowLeaveTeamDialog] = useState(false);
  const [showDeleteTeamDialog, setShowDeleteTeamDialog] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isCurrentUserTeamLeader, setIsCurrentUserTeamLeader] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [localTeamDescription, setLocalTeamDescription] = useState(team.description || "");
  const [localContactEmail, setLocalContactEmail] = useState(team.contact || "");
  const [isEditingBio, setIsEditingBio] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const isLeader = team.members.some((m: any) => 
          m.id === user.id && (m.role === "Chef d'équipe" || m.isTeamLeader)
        );
        
        setIsCurrentUserTeamLeader(isLeader);
      } catch (error) {
        console.error("Error checking user role:", error);
      }
    };
    
    checkUserRole();
  }, [team]);

  const handleUpdateContactInfo = async () => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('teams')
        .update({ contact: localContactEmail })
        .eq('id', team.id);
        
      if (error) throw error;
      
      toast({
        title: "Informations mises à jour",
        description: "L'adresse de contact a été mise à jour avec succès"
      });
      
      if (onTeamUpdate) onTeamUpdate({ ...team, contact: localContactEmail });
    } catch (error) {
      console.error("Error updating contact info:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des informations",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateMemberRole = async (memberId: string, newRole: string) => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
        .eq('user_id', memberId)
        .eq('team_id', team.id);
        
      if (error) throw error;
      
      toast({
        title: "Rôle mis à jour",
        description: `Le rôle du membre a été mis à jour avec succès`
      });
      
      setSelectedMember(null);
      if (onTeamUpdate) onTeamUpdate({ ...team });
    } catch (error) {
      console.error("Error updating member role:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du rôle",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!selectedMember) return;
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('user_id', selectedMember.id)
        .eq('team_id', team.id);
        
      if (error) throw error;
      
      toast({
        title: "Membre supprimé",
        description: `${selectedMember.username} a été retiré de l'équipe`
      });
      
      setShowDeleteMemberDialog(false);
      setSelectedMember(null);
      if (onTeamUpdate) onTeamUpdate({ ...team });
    } catch (error) {
      console.error("Error deleting member:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du membre",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLeaveTeam = async () => {
    try {
      setIsUpdating(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour quitter l'équipe",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('user_id', user.id)
        .eq('team_id', team.id);
        
      if (error) throw error;
      
      toast({
        title: "Équipe quittée",
        description: "Vous avez quitté l'équipe avec succès"
      });
      
      setShowLeaveTeamDialog(false);
      navigate('/profile');
    } catch (error) {
      console.error("Error leaving team:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du départ de l'équipe",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDeleteTeam = async () => {
    if (!isCurrentUserTeamLeader) {
      toast({
        title: "Action non autorisée",
        description: "Seuls les chefs d'équipe peuvent supprimer l'équipe",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', team.id);
        
      if (error) throw error;
      
      toast({
        title: "Équipe supprimée",
        description: "L'équipe a été supprimée avec succès"
      });
      
      setShowDeleteTeamDialog(false);
      navigate('/profile');
    } catch (error) {
      console.error("Error deleting team:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'équipe",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
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
      setBannerFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setBannerPreview(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMedia = async () => {
    try {
      setIsUpdating(true);
      let logoUrl = team.logo;
      let bannerUrl = team.banner;
      
      // Upload logo if changed
      if (logoFile) {
        const logoFileName = `team_logo_${team.id}_${Date.now()}`;
        const { data: logoData, error: logoError } = await supabase.storage
          .from('team_media')
          .upload(logoFileName, logoFile, { upsert: true });
          
        if (logoError) {
          console.error("Error uploading logo:", logoError);
          throw logoError;
        }
        
        // Get public URL
        const { data: logoPublicURL } = supabase.storage
          .from('team_media')
          .getPublicUrl(logoFileName);
          
        logoUrl = logoPublicURL.publicUrl;
      }
      
      // Upload banner if changed
      if (bannerFile) {
        const bannerFileName = `team_banner_${team.id}_${Date.now()}`;
        const { data: bannerData, error: bannerError } = await supabase.storage
          .from('team_media')
          .upload(bannerFileName, bannerFile, { upsert: true });
          
        if (bannerError) {
          console.error("Error uploading banner:", bannerError);
          throw bannerError;
        }
        
        // Get public URL
        const { data: bannerPublicURL } = supabase.storage
          .from('team_media')
          .getPublicUrl(bannerFileName);
          
        bannerUrl = bannerPublicURL.publicUrl;
      }
      
      // Update team record with new media URLs
      const { error } = await supabase
        .from('teams')
        .update({ 
          logo: logoUrl,
          banner: bannerUrl
        })
        .eq('id', team.id);
        
      if (error) throw error;
      
      toast({
        title: "Médias mis à jour",
        description: "Les médias de l'équipe ont été mis à jour avec succès"
      });
      
      // Clear file states
      setLogoFile(null);
      setBannerFile(null);
      
      if (onTeamUpdate) onTeamUpdate({ 
        ...team, 
        logo: logoUrl, 
        banner: bannerUrl 
      });
    } catch (error: any) {
      console.error("Error updating team media:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour des médias",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveDescription = async () => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('teams')
        .update({ description: localTeamDescription })
        .eq('id', team.id);

      if (error) throw error;

      toast({
        title: "Description mise à jour",
        description: "La description de l'équipe a été mise à jour avec succès"
      });

      setIsEditingBio(false);
      if (onTeamUpdate) onTeamUpdate({ 
        ...team, 
        description: localTeamDescription 
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la description:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la description",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Paramètres de l'équipe</DialogTitle>
            <DialogDescription>
              Gérez les paramètres et les membres de votre équipe.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="contact">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="members">Membres</TabsTrigger>
              <TabsTrigger value="media">Médias</TabsTrigger>
              <TabsTrigger value="about">À propos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="contact" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email de contact</Label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <Input 
                    id="email" 
                    value={localContactEmail} 
                    onChange={(e) => setLocalContactEmail(e.target.value)}
                    placeholder="email@example.com" 
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Cette adresse sera utilisée pour recevoir les messages via le bouton "Contacter".
                </p>
              </div>
              
              <DialogFooter>
                <Button onClick={handleUpdateContactInfo} disabled={isUpdating}>
                  {isUpdating ? "Enregistrement..." : "Enregistrer"}
                </Button>
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
                        setMemberRole(member.role || "");
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
                            {member.role === "Chef d'équipe" && (
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
                        {selectedMember?.id === member.id && member.role !== "Chef d'équipe" && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteMemberDialog(true);
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
                          disabled={selectedMember.role === "Chef d'équipe" && isCurrentUserTeamLeader}
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
                        <Button onClick={() => handleUpdateMemberRole(selectedMember.id, memberRole)} disabled={isUpdating}>
                          {isUpdating ? "Enregistrement..." : "Enregistrer"}
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
                <Button onClick={handleSaveMedia} disabled={isUpdating}>
                  {isUpdating ? "Enregistrement..." : "Enregistrer les médias"}
                </Button>
              </DialogFooter>
            </TabsContent>

            <TabsContent value="about" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Description de l'équipe</Label>
                {isEditingBio ? (
                  <div className="space-y-2">
                    <Textarea
                      value={localTeamDescription}
                      onChange={(e) => setLocalTeamDescription(e.target.value)}
                      placeholder="Décrivez votre équipe..."
                      rows={4}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setLocalTeamDescription(team.description || "");
                          setIsEditingBio(false);
                        }}
                      >
                        Annuler
                      </Button>
                      <Button 
                        onClick={handleSaveDescription} 
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Enregistrement..." : "Enregistrer"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 justify-between">
                    <p className="text-gray-700">
                      {localTeamDescription || "Aucune description"}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsEditingBio(true)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="border-t pt-4 space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start text-amber-600 border-amber-200 hover:bg-amber-50"
              onClick={() => setShowLeaveTeamDialog(true)}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Quitter l'équipe
            </Button>
            
            {isCurrentUserTeamLeader && (
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setShowDeleteTeamDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer l'équipe
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Member Dialog */}
      <AlertDialog open={showDeleteMemberDialog} onOpenChange={setShowDeleteMemberDialog}>
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
      
      {/* Leave Team Dialog */}
      <AlertDialog open={showLeaveTeamDialog} onOpenChange={setShowLeaveTeamDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Quitter l'équipe</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir quitter cette équipe ? Vous pourrez toujours demander à rejoindre l'équipe ultérieurement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-amber-500 hover:bg-amber-700 text-white" 
              onClick={handleLeaveTeam}
            >
              Quitter l'équipe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Team Dialog */}
      <AlertDialog open={showDeleteTeamDialog} onOpenChange={setShowDeleteTeamDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Supprimer l'équipe
            </AlertDialogTitle>
            <AlertDialogDescription>
              Attention ! Supprimer l'équipe est une action irréversible. Tous les membres, parties et données associés seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-700 text-white" 
              onClick={handleDeleteTeam}
              disabled={!isCurrentUserTeamLeader}
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TeamSettings;
