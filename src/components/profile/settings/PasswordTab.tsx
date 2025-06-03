
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Key } from 'lucide-react';

const PasswordTab = () => {
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mot de passe modifié",
      description: "Votre mot de passe a été mis à jour avec succès."
    });
  };

  return (
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
  );
};

export default PasswordTab;
