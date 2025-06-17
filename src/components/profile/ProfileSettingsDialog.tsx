
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import AccountTab from './settings/AccountTab';
import PasswordTab from './settings/PasswordTab';
import VerificationTab from './settings/VerificationTab';
import NotificationTab from './settings/NotificationTab';
import { useQueryClient } from "@tanstack/react-query";

interface ProfileSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
}

const ProfileSettingsDialog = ({
  open,
  onOpenChange,
  user
}: ProfileSettingsDialogProps) => {
  const [currentTab, setCurrentTab] = useState("account");
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const handleOpenChange = (newOpen: boolean) => {
    // Si on ferme le dialog, toujours rafraîchir le count des notifications
    if (!newOpen && user?.id) {
      console.log("Closing profile settings dialog, refreshing notification count");
      queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications', user.id] });
      
      // Supprimer le cache local pour forcer le rechargement
      const cacheKey = `notifications_count_${user.id}`;
      localStorage.removeItem(cacheKey);
    }
    onOpenChange(newOpen);
  };

  if (!user) {
    return null;
  }

  const content = (
    <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-4">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="account">Compte</TabsTrigger>
        <TabsTrigger value="password">Mot de passe</TabsTrigger>
        <TabsTrigger value="verification">Vérification</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      
      <TabsContent value="account" className="space-y-4">
        <AccountTab user={user} />
      </TabsContent>
      
      <TabsContent value="password">
        <PasswordTab />
      </TabsContent>
      
      <TabsContent value="verification">
        <VerificationTab user={user} />
      </TabsContent>

      <TabsContent value="notifications" className="space-y-4">
        <NotificationTab user={user} isActive={currentTab === "notifications"} />
      </TabsContent>
    </Tabs>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Paramètres du compte</DrawerTitle>
            <DrawerDescription>
              Gérez les paramètres de votre compte
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 overflow-y-auto flex-1">
            {content}
          </div>

          <DrawerFooter className="mt-4">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Fermer
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Paramètres du compte</DialogTitle>
          <DialogDescription>
            Gérez les paramètres de votre compte
          </DialogDescription>
        </DialogHeader>

        {content}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettingsDialog;
