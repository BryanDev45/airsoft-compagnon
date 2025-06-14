
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

interface PersonalInfoEditorProps {
  profileData: any;
  onUpdate: () => void;
  isOwnProfile: boolean;
}

const LANGUAGES = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
  { value: 'nl', label: 'Nederlands' },
  { value: 'pl', label: 'Polski' },
  { value: 'ru', label: 'Русский' },
  { value: 'ar', label: 'العربية' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
];

export const PersonalInfoEditor: React.FC<PersonalInfoEditorProps> = ({
  profileData,
  onUpdate,
  isOwnProfile
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(profileData?.phone_number || '');
  const [spokenLanguage, setSpokenLanguage] = useState(profileData?.spoken_language || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    if (!profileData?.id) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          phone_number: phoneNumber || null,
          spoken_language: spokenLanguage || null
        })
        .eq('id', profileData.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Vos informations personnelles ont été mises à jour",
      });

      onUpdate();
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error updating personal info:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos informations",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOwnProfile) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit2 className="h-4 w-4 mr-2" />
          Modifier mes informations
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier mes informations personnelles</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Ex: +33 6 12 34 56 78"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Visible uniquement par vous
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Langue parlée</Label>
            <Select value={spokenLanguage} onValueChange={setSpokenLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une langue" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Visible par tous les utilisateurs
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
