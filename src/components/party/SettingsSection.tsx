
import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Euro } from 'lucide-react';
import { useFormContext } from "react-hook-form";
import { SettingsSectionProps } from '@/types/party';

const SettingsSection: React.FC<SettingsSectionProps> = ({ updateFormData, initialData }) => {
  const form = useFormContext();
  
  useEffect(() => {
    if (initialData && updateFormData) {
      updateFormData('settings', {
        maxPlayers: initialData.max_players,
        price: initialData.price,
        manualValidation: initialData.manual_validation,
        hasToilets: initialData.has_toilets,
        hasParking: initialData.has_parking,
        hasEquipmentRental: initialData.has_equipment_rental,
        isPrivate: initialData.is_private
      });
    }
  }, [initialData, updateFormData]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-airsoft-red" />
          Paramètres & Limitations
        </CardTitle>
        <CardDescription>
          Définissez les paramètres de votre partie
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField 
          control={form.control} 
          name="maxPlayers" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre maximum de joueurs</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input type="number" min="2" className="w-full" {...field} />
                  <Users className="ml-2 h-5 w-5 text-gray-400" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <FormField 
          control={form.control} 
          name="price" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix par joueur (€)</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input type="number" min="5" step="0.5" className="w-full" {...field} />
                  <Euro className="ml-2 h-5 w-5 text-gray-400" />
                </div>
              </FormControl>
              <FormMessage />
              <p className="text-sm text-gray-500 mt-1">Le prix minimum est de 5€ (incluant 1€ de frais de gestion revenant à Airsoft Compagnon)</p>
            </FormItem>
          )} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField 
            control={form.control} 
            name="manualValidation" 
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Validation manuelle</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Les demandes de participation doivent être validées manuellement
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
            name="hasToilets" 
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Toilettes</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Des toilettes sont disponibles sur le terrain
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
            name="hasParking" 
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Parking</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Un parking est disponible sur place
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
            name="hasEquipmentRental" 
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Location de matériel</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Des répliques et équipements sont disponibles à la location
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
            name="isPrivate" 
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Partie privée</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    La partie sera visible uniquement via un lien d'invitation
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

export default SettingsSection;
