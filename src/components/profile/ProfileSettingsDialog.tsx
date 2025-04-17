
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Shield, Mail, Key, CheckCircle2 } from 'lucide-react';

interface ProfileSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
}

const ProfileSettingsDialog = ({ open, onOpenChange, user }: ProfileSettingsDialogProps) => {
  const [currentTab, setCurrentTab] = useState("account");
  const [verificationRequested, setVerificationRequested] = useState(false);

  const handleRequestVerification = () => {
    setVerificationRequested(true);
    toast({
      title: "Demande envoyée",
      description: "Votre demande de vérification a été envoyée avec succès. Vous recevrez un email prochainement."
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mot de passe modifié",
      description: "Votre mot de passe a été mis à jour avec succès."
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Paramètres du compte</DialogTitle>
          <DialogDescription>
            Gérez les paramètres de votre compte
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="account">Compte</TabsTrigger>
            <TabsTrigger value="password">Mot de passe</TabsTrigger>
            <TabsTrigger value="verification">Vérification</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1">
                <Mail size={16} /> Email
              </Label>
              <Input id="email" value={user.email} readOnly className="bg-gray-50" />
              <p className="text-xs text-gray-500">
                Cet email est utilisé pour la connexion et les notifications
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Type de compte</h4>
                <p className="text-sm text-gray-500">
                  {user.premium ? "Compte Premium" : "Compte Standard"}
                </p>
              </div>
              {!user.premium && (
                <Button variant="outline" size="sm">
                  Passer Premium
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="password">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="flex items-center gap-1">
                  <Key size={16} /> Mot de passe actuel
                </Label>
                <Input id="current-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password" className="flex items-center gap-1">
                  <Key size={16} /> Nouveau mot de passe
                </Label>
                <Input id="new-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="flex items-center gap-1">
                  <Key size={16} /> Confirmer le mot de passe
                </Label>
                <Input id="confirm-password" type="password" />
              </div>
              
              <Button type="submit" className="w-full bg-airsoft-red hover:bg-red-700">
                Mettre à jour le mot de passe
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="verification">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield size={20} />
                  <h4 className="font-medium">Vérification du compte</h4>
                </div>
                {user.verified ? (
                  <Badge className="bg-blue-500">Vérifié</Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100 text-gray-700">Non vérifié</Badge>
                )}
              </div>
              
              {user.verified ? (
                <Alert className="bg-blue-50 border-blue-200">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  <AlertDescription>
                    Votre compte est vérifié. Votre badge de vérification est visible sur votre profil.
                  </AlertDescription>
                </Alert>
              ) : verificationRequested ? (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertDescription>
                    Votre demande de vérification est en cours de traitement. Vous recevrez un email lorsque votre compte sera vérifié.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <p className="text-sm text-gray-500">
                    La vérification de compte permet de garantir votre identité et d'obtenir un badge de vérification sur votre profil. Pour être vérifié, nous avons besoin d'une preuve d'identité.
                  </p>
                  
                  <Button 
                    onClick={handleRequestVerification} 
                    className="w-full bg-airsoft-red hover:bg-red-700"
                  >
                    Demander une vérification
                  </Button>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettingsDialog;
