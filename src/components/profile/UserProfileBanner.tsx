
import React, { useEffect } from 'react';
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";

interface UserProfileBannerProps {
  userData: any;
}

const UserProfileBanner: React.FC<UserProfileBannerProps> = ({ userData }) => {
  useEffect(() => {
    if (userData?.Ban === true) {
      toast({
        title: "Utilisateur banni",
        description: "Ce compte a été banni par un administrateur",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [userData]);

  if (userData?.Ban !== true) return null;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Compte banni</AlertTitle>
      <AlertDescription>
        <div>Ce compte utilisateur a été banni par un administrateur.</div>
        {userData?.ban_reason && (
          <div className="mt-2 font-medium">
            Raison : {userData.ban_reason}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default UserProfileBanner;
