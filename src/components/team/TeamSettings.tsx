import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  PenBox, 
  Settings, 
  X, 
  Save, 
  Camera, 
  Trash2, 
  LogOut, 
  UserPlus, 
  UserMinus, 
  Check,
  LockOpen,
  Lock
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";

// Define types for team members to include the status field
interface TeamMember {
  id: string;
  user_id?: string;
  team_id?: string;
  role?: string;
  joined_at?: string;
  status?: string;
  profiles?: {
    id: string;
    username?: string;
    avatar?: string;
  };
}

interface TeamData {
  id: string;
  name: string;
  logo?: string;
  banner?: string;
  description?: string;
  location?: string;
  contact?: string;
  leader_id?: string;
  is_recruiting?: boolean;
  founded?: string;
  is_association?: boolean;
}

interface TeamSettingsProps {
  team: TeamData;
  isTeamMember: boolean;
  onTeamUpdate?: (updatedTeam: Partial<TeamData>) => void;
}

const TeamSettings = ({ team, isTeamMember, onTeamUpdate }: TeamSettingsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(team?.name || '');
  const [location, setLocation] = useState(team?.location || '');
  const [founded, setFounded] = useState(team?.founded || '');
  const [description, setDescription] = useState(team?.description || '');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState(team?.logo || '');
  const [bannerPreview, setBannerPreview] = useState(team?.banner || '');
  const [loading, setLoading] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [currentTab, setCurrentTab] = useState('general');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingMembers, setPendingMembers] = useState<TeamMember[]>([]);
  const [isRecruitmentOpen, setIsRecruitmentOpen] = useState(team?.is_recruiting || false);
  const [isAssociation, setIsAssociation] = useState(team?.is_association || false);
  
  // Vérifier si l'utilisateur est le propriétaire de l'équipe
  const isTeamLeader = user?.id === team?.leader_id;
  
  // If the user is not a team member, don't render the component
  if (!isTeamMember) return null;
  
  // Fonction pour récupérer les membres de l'équipe
  const fetchTeamMembers = async () => {
    if (!team?.id) return;
    
    try {
      console.log("Fetching team members for team:", team.id);
      
      const { data: allMembers, error } = await supabase
        .from('team_members')
        .select('id, user_id, team_id, role, status, profiles:user_id(id, username, avatar)')
        .eq('team_id', team.id);
        
      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }

      console.log("All team members:", allMembers);
      
      // Make sure members is an array before filtering
      if (!Array.isArray(allMembers)) {
        console.error('Fetched members is not an array:', allMembers);
        setTeamMembers([]);
        setPendingMembers([]);
        return;
      }
      
      // Séparer les membres confirmés et les demandes en attente
      const confirmed = allMembers.filter(m => m.status === 'confirmed') || [];
      const pending = allMembers.filter(m => m.status === 'pending') || [];
      
      console.log("Confirmed members:", confirmed);
      console.log("Pending members:", pending);
      
      // Type casting for TypeScript
      setTeamMembers(confirmed as unknown as TeamMember[]);
      setPendingMembers(pending as unknown as TeamMember[]);
    } catch (error) {
      console.error('Erreur lors de la récupération des membres:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les membres de l'équipe",
        variant: "destructive"
      });
    }
  };
  
  useEffect(() => {
    if (open) {
      console.log("Dialog opened, fetching team members");
      fetchTeamMembers();
      setIsRecruitmentOpen(team?.is_recruiting || false);
      setIsAssociation(team?.is_association || false);
    }
  }, [open, team?.id]);
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateTeamMedia = async () => {
    try {
      let newLogoUrl = team?.logo;
      let newBannerUrl = team?.banner;
      
      // Upload new logo if changed
      if (logoFile) {
        const logoFileName = `team_${team.id}_logo_${Date.now()}`;
        const { data: logoData, error: logoError } = await supabase.storage
          .from('team_media')
          .upload(logoFileName, logoFile);
          
        if (logoError) throw logoError;
        
        const { data: logoPublicUrl } = supabase.storage
          .from('team_media')
          .getPublicUrl(logoFileName);
          
        newLogoUrl = logoPublicUrl.publicUrl;
      }
      
      // Upload new banner if changed
      if (bannerFile) {
        const bannerFileName = `team_${team.id}_banner_${Date.now()}`;
        const { data: bannerData, error: bannerError } = await supabase.storage
          .from('team_media')
          .upload(bannerFileName, bannerFile);
          
        if (bannerError) throw bannerError;
        
        const { data: bannerPublicUrl } = supabase.storage
          .from('team_media')
          .getPublicUrl(bannerFileName);
          
        newBannerUrl = bannerPublicUrl.publicUrl;
      }
      
      // Update team with new media URLs
      const { error } = await supabase
        .from('teams')
        .update({
          logo: newLogoUrl,
          banner: newBannerUrl
        })
        .eq('id', team.id);
        
      if (error) throw error;
      
      // Notify parent component about the update with the updated team object
      if (onTeamUpdate) {
        onTeamUpdate({
          ...team,
          logo: newLogoUrl,
          banner: newBannerUrl
        });
      }
      
      return { logo: newLogoUrl, banner: newBannerUrl };
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour des médias:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les médias de l'équipe: " + error.message,
        variant: "destructive",
      });
      return null;
    }
  };
  
  const updateTeamInfo = async (mediaUrls: { logo?: string, banner?: string } = {}) => {
    try {
      const updatedFields = {
        name,
        location,
        founded,
        description,
        is_association: isAssociation,
        ...mediaUrls
      };
      
      const { error } = await supabase
        .from('teams')
        .update(updatedFields)
        .eq('id', team.id);
        
      if (error) throw error;
      
      // Notify parent component about the update with updated team object
      if (onTeamUpdate) {
        onTeamUpdate({
          ...team,
          ...updatedFields
        });
      }
      
      return true;
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de l'équipe:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations de l'équipe: " + error.message,
        variant: "destructive",
      });
      return false;
    }
  };
  
  const handleSave = async () => {
    setLoading(true);
    
    try {
      let mediaUrls = {};
      
      // Update media files if any changed
      if (logoFile || bannerFile) {
        const mediaResult = await updateTeamMedia();
        if (mediaResult) {
          mediaUrls = mediaResult;
        }
      }
      
      // Update team information
      await updateTeamInfo(mediaUrls);
      
      setOpen(false);
      
      toast({
        title: "Équipe mise à jour",
        description: "Les informations de l'équipe ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des modifications:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateDescription = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('teams')
        .update({ description })
        .eq('id', team.id);
        
      if (error) throw error;
      
      // Notify parent component about the update with updated team object
      if (onTeamUpdate) {
        onTeamUpdate({
          ...team,
          description
        });
      }
      
      toast({
        title: "Description mise à jour",
        description: "La description de votre équipe a été mise à jour avec succès.",
      });
      
      setIsEditingBio(false);
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de la description:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la description: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteTeam = async () => {
    // Only team leaders can delete the team
    if (!isTeamLeader) {
      toast({
        title: "Accès refusé",
        description: "Seul le propriétaire de l'équipe peut supprimer l'équipe.",
        variant: "destructive",
      });
      return;
    }
    
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette équipe ? Cette action est irréversible.")) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Delete all team members first
      const { error: membersError } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', team.id);
        
      if (membersError) throw membersError;
      
      // Then delete the team
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', team.id);
        
      if (error) throw error;
      
      toast({
        title: "Équipe supprimée",
        description: "L'équipe a été supprimée avec succès.",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error("Erreur lors de la suppression de l'équipe:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'équipe: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLeaveTeam = async () => {
    if (!user?.id || !team?.id) return;
    
    // Prevent the team leader from leaving without transferring ownership
    if (isTeamLeader) {
      toast({
        title: "Action impossible",
        description: "En tant que leader de l'équipe, vous devez transférer la propriété avant de quitter ou supprimer l'équipe.",
        variant: "destructive",
      });
      return;
    }
    
    if (!confirm("Êtes-vous sûr de vouloir quitter cette équipe ?")) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', team.id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Équipe quittée",
        description: "Vous avez quitté l'équipe avec succès.",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error("Erreur lors du départ de l'équipe:", error);
      toast({
        title: "Erreur",
        description: "Impossible de quitter l'équipe: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAcceptMember = async (memberId: string) => {
    if (!isTeamLeader) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ status: 'confirmed' })
        .eq('id', memberId);
        
      if (error) throw error;
      
      fetchTeamMembers();
      
      toast({
        title: "Membre accepté",
        description: "Le membre a été accepté dans l'équipe.",
      });
    } catch (error: any) {
      console.error("Erreur lors de l'acceptation du membre:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter le membre: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRejectMember = async (memberId: string) => {
    if (!isTeamLeader) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);
        
      if (error) throw error;
      
      fetchTeamMembers();
      
      toast({
        title: "Membre rejeté",
        description: "La demande d'adhésion a été rejetée.",
      });
    } catch (error: any) {
      console.error("Erreur lors du rejet du membre:", error);
      toast({
        title: "Erreur",
        description: "Impossible de rejeter le membre: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveMember = async (memberId: string) => {
    if (!isTeamLeader) return;
    
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce membre de l'équipe ?")) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);
        
      if (error) throw error;
      
      fetchTeamMembers();
      
      toast({
        title: "Membre supprimé",
        description: "Le membre a été supprimé de l'équipe.",
      });
    } catch (error: any) {
      console.error("Erreur lors de la suppression du membre:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le membre: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateMemberRole = async (memberId: string, newRole: string) => {
    if (!isTeamLeader) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
        .eq('id', memberId);
        
      if (error) throw error;
      
      fetchTeamMembers();
      
      toast({
        title: "Rôle mis à jour",
        description: "Le rôle du membre a été mis à jour avec succès.",
      });
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du rôle:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleRecruitment = async () => {
    if (!isTeamLeader) return;
    
    setLoading(true);
    
    try {
      const newStatus = !isRecruitmentOpen;
      
      const { error } = await supabase
        .from('teams')
        .update({ is_recruiting: newStatus })
        .eq('id', team.id);
        
      if (error) throw error;
      
      setIsRecruitmentOpen(newStatus);
      
      if (onTeamUpdate) {
        onTeamUpdate({
          ...team,
          is_recruiting: newStatus
        } as TeamData);
      }
      
      toast({
        title: newStatus ? "Recrutement ouvert" : "Recrutement fermé",
        description: newStatus 
          ? "Le recrutement est maintenant ouvert pour votre équipe." 
          : "Le recrutement est maintenant fermé pour votre équipe.",
      });
    } catch (error: any) {
      console.error("Erreur lors de la modification du statut de recrutement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de recrutement: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleAssociation = async () => {
    if (!isTeamLeader) return;
    
    setLoading(true);
    
    try {
      const newStatus = !isAssociation;
      
      const { error } = await supabase
        .from('teams')
        .update({ is_association: newStatus })
        .eq('id', team.id);
        
      if (error) throw error;
      
      setIsAssociation(newStatus);
      
      if (onTeamUpdate) {
        onTeamUpdate({
          ...team,
          is_association: newStatus
        } as TeamData);
      }
      
      toast({
        title: "Statut mis à jour",
        description: newStatus 
          ? "Votre équipe est maintenant définie comme une association déclarée." 
          : "Votre équipe n'est plus définie comme une association déclarée.",
      });
    } catch (error: any) {
      console.error("Erreur lors de la modification du statut d'association:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut d'association: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Render the settings button for team members
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-6 right-6 bg-black/50 hover:bg-black/70 text-white"
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only">Paramètres de l'équipe</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isTeamLeader ? "Paramètres de l'équipe" : "Gestion de l'équipe"}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="media">Média</TabsTrigger>
            <TabsTrigger value="members">Membres</TabsTrigger>
            <TabsTrigger value="danger">Danger</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom de l'équipe</label>
              <Input 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="Nom de l'équipe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Localisation</label>
              <Input 
                value={location} 
                onChange={e => setLocation(e.target.value)}
                placeholder="Localisation"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date de fondation</label>
              <Input 
                value={founded} 
                onChange={e => setFounded(e.target.value)}
                placeholder="Année de fondation"
                type="number"
                min="1990"
                max="2099"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description de l'équipe</label>
              {isEditingBio ? (
                <div className="space-y-2">
                  <Textarea 
                    value={description} 
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Description de l'équipe"
                    className="h-32"
                  />
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setDescription(team.description || '');
                        setIsEditingBio(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Annuler
                    </Button>
                    
                    <Button 
                      size="sm"
                      onClick={handleUpdateDescription}
                      disabled={loading}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {loading ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="border rounded-md p-3 bg-gray-50 min-h-[100px]">
                    {description || <span className="text-gray-400 italic">Aucune description</span>}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 text-gray-600 hover:text-gray-900"
                    onClick={() => setIsEditingBio(true)}
                  >
                    <PenBox className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            {isTeamLeader && (
              <>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Statut du recrutement</h3>
                      <p className="text-sm text-gray-500">
                        Autorisez de nouveaux membres à rejoindre votre équipe
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <Switch 
                        checked={isRecruitmentOpen} 
                        onCheckedChange={handleToggleRecruitment}
                        disabled={loading}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2"
                        onClick={handleToggleRecruitment}
                        disabled={loading}
                      >
                        {isRecruitmentOpen ? (
                          <>
                            <Lock className="h-4 w-4 mr-1" />
                            Fermer
                          </>
                        ) : (
                          <>
                            <LockOpen className="h-4 w-4 mr-1" />
                            Ouvrir
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Association déclarée</h3>
                      <p className="text-sm text-gray-500">
                        Indiquer si votre équipe est une association loi 1901 déclarée
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <Switch 
                        checked={isAssociation} 
                        onCheckedChange={handleToggleAssociation}
                        disabled={loading}
                      />
                      <span className="ml-2 text-sm font-medium">
                        {isAssociation ? "Oui" : "Non"}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="media" className="space-y-6 pt-4">
            <div>
              <label className="block text-sm font-medium mb-2">Logo de l'équipe</label>
              <div className="flex items-center space-x-4">
                <div className="h-24 w-24 rounded-full border bg-gray-100 overflow-hidden flex items-center justify-center">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Logo prévisualisé" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                
                <div>
                  <Button asChild variant="outline" className="mb-2">
                    <label className="cursor-pointer">
                      <Camera className="h-4 w-4 mr-2" />
                      Changer le logo
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleLogoChange}
                      />
                    </label>
                  </Button>
                  
                  <p className="text-xs text-gray-500">
                    Format recommandé: carré, 1:1. JPG ou PNG.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Bannière de l'équipe</label>
              <div className="h-40 w-full rounded-md border bg-gray-100 overflow-hidden flex items-center justify-center mb-4">
                {bannerPreview ? (
                  <img 
                    src={bannerPreview} 
                    alt="Bannière prévisualisée" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Upload className="h-12 w-12 text-gray-400" />
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Format recommandé: 16:9 ou 4:1. JPG ou PNG. Résolution minimum 1280x720px.
                </p>
                
                <Button asChild variant="outline">
                  <label className="cursor-pointer">
                    <Camera className="h-4 w-4 mr-2" />
                    Changer la bannière
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleBannerChange}
                    />
                  </label>
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="members" className="pt-4 space-y-6">
            {isTeamLeader && pendingMembers.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Demandes d'adhésion en attente ({pendingMembers.length})</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Membre</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                            <img 
                              src={member.profiles?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.profiles?.username || 'user'}`} 
                              alt={member.profiles?.username || "Utilisateur"} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span>{member.profiles?.username || "Utilisateur"}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleAcceptMember(member.id)}
                              disabled={loading}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Accepter
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRejectMember(member.id)}
                              disabled={loading}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Refuser
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            <div>
              <h3 className="font-medium mb-2">Membres de l'équipe ({teamMembers.length})</h3>
              {teamMembers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Membre</TableHead>
                      {isTeamLeader && <TableHead>Rôle</TableHead>}
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                            <img 
                              src={member.profiles?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.profiles?.username || 'user'}`}
                              alt={member.profiles?.username || "Utilisateur"} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span>{member.profiles?.username || "Utilisateur"}</span>
                          {member.user_id === team.leader_id && (
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                              Leader
                            </span>
                          )}
                        </TableCell>
                        
                        {isTeamLeader && (
                          <TableCell>
                            {member.user_id !== team.leader_id && (
                              <ToggleGroup 
                                type="single" 
                                value={member.role || "Membre"}
                                onValueChange={(value) => {
                                  if (value) handleUpdateMemberRole(member.id, value);
                                }}
                                className="justify-start"
                              >
                                <ToggleGroupItem value="Membre" size="sm">Membre</ToggleGroupItem>
                                <ToggleGroupItem value="Modérateur" size="sm">Modérateur</ToggleGroupItem>
                                <ToggleGroupItem value="Admin" size="sm">Admin</ToggleGroupItem>
                              </ToggleGroup>
                            )}
                          </TableCell>
                        )}
                        
                        <TableCell>
                          {isTeamLeader && member.user_id !== team.leader_id && member.user_id !== user?.id && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRemoveMember(member.id)}
                              disabled={loading}
                            >
                              <UserMinus className="h-4 w-4 mr-1" />
                              Supprimer
                            </Button>
                          )}
                          
                          {!isTeamLeader && member.user_id === user?.id && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handleLeaveTeam}
                              disabled={loading}
                            >
                              <LogOut className="h-4 w-4 mr-1" />
                              Quitter
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-4">Aucun membre confirmé dans l'équipe</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="danger" className="pt-4 space-y-4">
            {!isTeamLeader ? (
              <div className="border rounded-md p-4 bg-red-50 border-red-200">
                <h3 className="font-semibold text-red-700 mb-2">Quitter l'équipe</h3>
                <p className="text-sm text-red-600 mb-4">
                  Attention : cette action est irréversible. Vous ne serez plus membre de cette équipe.
                </p>
                
                <Button 
                  variant="destructive" 
                  onClick={handleLeaveTeam}
                  disabled={loading}
                  className="flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {loading ? "Traitement..." : "Quitter cette équipe"}
                </Button>
              </div>
            ) : (
              <div className="border rounded-md p-4 bg-red-50 border-red-200">
                <h3 className="font-semibold text-red-700 mb-2">Zone de danger</h3>
                <p className="text-sm text-red-600 mb-4">
                  Attention : les actions ci-dessous sont irréversibles et peuvent entraîner la perte définitive de données.
                </p>
                
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteTeam}
                  disabled={loading}
                  className="flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {loading ? "Suppression..." : "Supprimer cette équipe"}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <div className="flex justify-end gap-2 w-full">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            
            <Button 
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeamSettings;
