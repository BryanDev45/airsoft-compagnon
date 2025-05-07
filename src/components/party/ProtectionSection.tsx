
import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from 'lucide-react';
import { useFormContext } from "react-hook-form";
import { ProtectionSectionProps } from '@/types/party';

const ProtectionSection: React.FC<ProtectionSectionProps> = ({ updateFormData, initialData }) => {
  const form = useFormContext();
  
  useEffect(() => {
    if (initialData && updateFormData) {
      updateFormData('protection', {
        eyeProtectionRequired: initialData.eye_protection_required,
        fullFaceProtectionRequired: initialData.full_face_protection_required
      });
    }
  }, [initialData, updateFormData]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-airsoft-red" />
          Protection
        </CardTitle>
        <CardDescription>
          Exigences de protection pour les joueurs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField 
            control={form.control} 
            name="eyeProtectionRequired" 
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Protection oculaire</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Obligatoire pour tous les joueurs
                  </p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )} 
          />
          
          <FormField 
            control={form.control} 
            name="fullFaceProtectionRequired" 
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Protection intégrale</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Obligatoire pour tous les joueurs (masque complet)
                  </p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProtectionSection;
