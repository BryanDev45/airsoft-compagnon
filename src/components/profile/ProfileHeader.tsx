
import React, { useState } from 'react';
import { Edit, Save, Settings, LogOut, Calendar, Trophy, Clock, Shield, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

interface ProfileHeaderProps {
  user: any;
  editing: boolean;
  setEditing: (editing: boolean) => void;
  handleLogout: () => void;
  handleViewAllBadges: () => void;
}

const ProfileHeader = ({ user, editing, setEditing, handleLogout, handleViewAllBadges }: ProfileHeaderProps) => {
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  
  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Succès",
      description: "Votre mot de passe a été modifié avec succès",
    });
    
    setNewPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
  };
  
  const handleVerificationRequest = () => {
    toast({
      title: "Demande envoyée",
      description: "Votre demande de vérification d'identité a été envoyée. Vous recevrez une réponse par email dans les prochains jours.",
    });
    setShowSettingsDialog(false);
  };
  
  return (
    <div className="bg-airsoft-dark text-white p-6 relative">
      <div className="absolute right-6 top-6 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-white border-white hover:bg-white/20 hover:text-white bg-airsoft-red border-airsoft-red"
          onClick={() => setEditing(!editing)}
        >
          {editing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
          {editing ? "Sauvegarder" : "Modifier"}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-white border-white hover:bg-white/20 hover:text-white bg-airsoft-red border-airsoft-red"
          onClick={() => setShowSettingsDialog(true)}
        >
          <Settings className="mr-2 h-4 w-4" />
          Paramètres
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-white border-white hover:bg-white/20 hover:text-white bg-airsoft-red border-airsoft-red"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <img 
            src={user.avatar} 
            alt={user.username} 
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
          {editing && (
            <Button 
              size="sm" 
              className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-airsoft-red hover:bg-red-700"
            >
              <Edit size={14} />
            </Button>
          )}
        </div>
        
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            {user.username}
            {user.isVerified && (
              <img 
                src="/lovable-uploads/3c025802-3046-4c34-ae5e-2328e941b479.png"
                alt="Vérifié"
                className="w-6 h-6 ml-1"
                title="Profil vérifié"
              />
            )}
          </h1>
          <div className="flex items-center gap-1 text-sm text-gray-200">
            <Calendar size={14} />
            <span>Membre depuis {user.joinDate}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary" className="bg-airsoft-red border-none">
              <Trophy size={14} className="mr-1" /> {user.stats.level}
            </Badge>
            <Badge variant="outline" className="text-white border-white">
              <Clock size={14} className="mr-1" /> {user.stats.gamesPlayed} parties
            </Badge>
            <Badge variant="outline" className="text-white border-white">
              <Shield size={14} className="mr-1" /> {user.stats.gamesOrganized} organisées
            </Badge>
            <Badge 
              variant="outline" 
              className="text-white border-white cursor-pointer hover:bg-white/10"
              onClick={handleViewAllBadges}
            >
              <Award size={14} className="mr-1" /> {user.badges.length} badges
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Paramètres du compte</DialogTitle>
            <DialogDescription>
              Gérez vos informations personnelles et les paramètres de sécurité.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="account">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">Compte</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
              <TabsTrigger value="verification">Vérification</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input id="email" value={user.email} readOnly />
                <p className="text-sm text-gray-500">
                  Cette adresse est utilisée pour la connexion et les notifications.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input id="username" value={user.username} readOnly />
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              
              <Button 
                className="w-full bg-airsoft-red hover:bg-red-700"
                onClick={handleSavePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword}
              >
                Changer le mot de passe
              </Button>
            </TabsContent>
            
            <TabsContent value="verification" className="space-y-4 pt-4">
              {user.isVerified ? (
                <div className="flex items-center space-x-2 p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
                  <img 
                    src="/lovable-uploads/3c025802-3046-4c34-ae5e-2328e941b479.png"
                    alt="Vérifié"
                    className="w-5 h-5"
                  />
                  <span>Votre profil est vérifié</span>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <h3 className="font-medium">Demander une vérification de profil</h3>
                    <p className="text-sm text-gray-500">
                      La vérification de votre identité vous permet d'avoir accès à plus de fonctionnalités et d'augmenter la confiance des autres joueurs envers vous.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-amber-50 text-amber-700 rounded-md border border-amber-200 text-sm">
                    Pour obtenir le badge de vérification, vous devrez fournir un document d'identité valide et une photo de vous tenant ce document. Ces informations seront traitées de manière confidentielle et supprimées après vérification.
                  </div>
                  
                  <Button 
                    className="w-full bg-airsoft-red hover:bg-red-700"
                    onClick={handleVerificationRequest}
                  >
                    Demander une vérification
                  </Button>
                </>
              )}
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileHeader;
