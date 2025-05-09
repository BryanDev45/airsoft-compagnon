
import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from 'lucide-react';
import { useFormContext } from "react-hook-form";
import { ProtectionSectionProps } from '@/types/party';

const ProtectionSection: React.FC<ProtectionSectionProps> = ({ updateFormData, initialData }) => {
  const form = useFormContext();
  
  useEffect(() => {
    if (initialData && updateFormData) {
      updateFormData('protection', {
        eyeProtectionRequired: initialData.eye_protection_required,
        fullFaceProtectionRequired: initialData.full_face_protection_required,
      });
    }
  }, [initialData, updateFormData]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-airsoft-red" />
          Protection
        </CardTitle>
        <CardDescription>
          Définissez les protections obligatoires pour participer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField 
            control={form.control} 
            name="eyeProtectionRequired" 
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div>
                  <FormLabel className="text-base">Protection oculaire obligatoire</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Lunettes ou masque homologué
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
                <div>
                  <FormLabel className="text-base">Protection faciale intégrale</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Masque intégral visage obligatoire
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
