
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountTab from './settings/AccountTab';
import PasswordTab from './settings/PasswordTab';
import VerificationTab from './settings/VerificationTab';
import NotificationTab from './settings/NotificationTab';

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
