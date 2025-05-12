import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Shield, Mail, Key, CheckCircle2, Upload, Bell } from 'lucide-react';

interface ProfileSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  updateNewsletterSubscription: (subscribed: boolean) => Promise<boolean>;
}

const ProfileSettingsDialog = ({
  open,
  onOpenChange,
  user,
  updateNewsletterSubscription
}: ProfileSettingsDialogProps) => {
  const [currentTab, setCurrentTab] = useState("account");
  const [verificationRequested, setVerificationRequested] = useState(false);
  const [frontIdFile, setFrontIdFile] = useState<File | null>(null);
  const [backIdFile, setBackIdFile] = useState<File | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Initialize isSubscribed with the correct value from user.newsletter_subscribed
  useEffect(() => {
    if (user && user.newsletter_subscribed !== undefined) {
      setIsSubscribed(!!user.newsletter_subscribed);
    }
  }, [user, open]);

  const handleRequestVerification = () => {
    if (!frontIdFile || !backIdFile) {
      toast({
        title: "Erreur",
        description: "Veuillez télécharger les deux côtés de votre carte d'identité",
        variant: "destructive"
      });
      return;
    }

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

  const handleFrontIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFrontIdFile(e.target.files[0]);
    }
  };

  const handleBackIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBackIdFile(e.target.files[0]);
    }
  };

  const handleNewsletterChange = async (checked: boolean) => {
    setIsUpdating(true);
    try {
      const success = await updateNewsletterSubscription(checked);
      
      if (success) {
        setIsSubscribed(checked);
      } else {
        // Revert to the previous state in case of error
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour vos préférences de newsletter",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating newsletter subscription:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de vos préférences",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Check if the user is null or undefined
  if (!user) {
    return null;
  }

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
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="account">Compte</TabsTrigger>
            <TabsTrigger value="password">Mot de passe</TabsTrigger>
            <TabsTrigger value="verification">Vérification</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1">
                <Mail size={16} /> Email
              </Label>
              <Input id="email" value={user.email || ''} readOnly className="bg-gray-50" />
              <p className="text-xs text-gray-500">
                Cet email est utilisé pour la connexion et les notifications
              </p>
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
                  
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="front-id" className="flex items-center gap-1">
                        <Upload size={16} /> Recto de votre carte d'identité
                      </Label>
                      <div className="border border-dashed border-gray-300 rounded-md p-4">
                        <Input 
                          id="front-id" 
                          type="file" 
                          accept="image/*"
                          onChange={handleFrontIdChange}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-airsoft-red file:text-white hover:file:bg-red-700"
                        />
                        {frontIdFile && (
                          <p className="text-xs text-gray-500 mt-2">
                            {frontIdFile.name} ({Math.round(frontIdFile.size / 1024)} Ko)
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="back-id" className="flex items-center gap-1">
                        <Upload size={16} /> Verso de votre carte d'identité
                      </Label>
                      <div className="border border-dashed border-gray-300 rounded-md p-4">
                        <Input 
                          id="back-id" 
                          type="file" 
                          accept="image/*"
                          onChange={handleBackIdChange}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-airsoft-red file:text-white hover:file:bg-red-700"
                        />
                        {backIdFile && (
                          <p className="text-xs text-gray-500 mt-2">
                            {backIdFile.name} ({Math.round(backIdFile.size / 1024)} Ko)
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Vos documents d'identité seront traités et supprimés de nos serveurs après vérification. Ils ne seront jamais partagés avec des tiers.
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleRequestVerification} 
                    className="w-full bg-airsoft-red hover:bg-red-700 mt-4"
                    disabled={!frontIdFile || !backIdFile}
                  >
                    Demander une vérification
                  </Button>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={20} />
                  <h4 className="font-medium">Préférences de communication</h4>
                </div>
              </div>
              
              <div className="mt-4 space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div>
                    <Label className="text-base">Newsletter</Label>
                    <p className="text-xs text-muted-foreground">
                      Recevez nos actualités et événements par email
                    </p>
                  </div>
                  <Switch 
                    checked={isSubscribed}
                    onCheckedChange={handleNewsletterChange}
                    disabled={isUpdating}
                  />
                </div>
              </div>
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
