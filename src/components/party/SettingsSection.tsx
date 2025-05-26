import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Users } from 'lucide-react';
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
          <Settings className="h-5 w-5 text-airsoft-red" />
          Paramètres
        </CardTitle>
        <CardDescription>
          Configurez les détails organisationnels de votre partie
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <FormField 
            control={form.control} 
            name="maxPlayers" 
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> Nombre maximum de joueurs
                </FormLabel>
                <FormControl>
                  <Input type="number" {...field} min="1" />
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
                  <Input type="number" {...field} min="5" step="0.01" />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 5€ (inclut 1€ de frais Airsoft Compagnon)
                </p>
              </FormItem>
            )} 
          />
        </div>
        
        <div className="mt-6 space-y-4">
          <FormField 
            control={form.control} 
            name="manualValidation" 
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div>
                  <FormLabel className="text-base">Validation manuelle</FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Approuvez manuellement chaque joueur qui souhaite s'inscrire
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
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div>
                  <FormLabel className="text-base">Partie privée</FormLabel>
                  <p className="text-xs text-muted-foreground">
                    La partie n'apparaîtra pas sur la carte et dans la recherche
                  </p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )} 
          />
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Installations disponibles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FormField 
              control={form.control} 
              name="hasToilets" 
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <FormLabel className="text-sm">Toilettes</FormLabel>
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <FormLabel className="text-sm">Parking</FormLabel>
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <FormLabel className="text-sm">Location d'équipement</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsSection;
