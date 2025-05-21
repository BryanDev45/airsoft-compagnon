
import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface StoreLocationSectionProps {
  form: UseFormReturn<any>;
  isGeocoding: boolean;
  coordinates: [number, number] | null;
  handleAddressChange: () => void;
}

export default function StoreLocationSection({
  form,
  isGeocoding,
  coordinates,
  handleAddressChange
}: StoreLocationSectionProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Adresse *</FormLabel>
            <FormControl>
              <Input 
                placeholder="123 rue des Airsofteurs" 
                className="rounded-md border-neutral-300 focus:border-airsoft-red focus:ring-airsoft-red"
                {...field} 
                onBlur={handleAddressChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Code postal *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="75001" 
                  className="rounded-md border-neutral-300 focus:border-airsoft-red focus:ring-airsoft-red"
                  {...field} 
                  onBlur={handleAddressChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Ville *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Paris" 
                  className="rounded-md border-neutral-300 focus:border-airsoft-red focus:ring-airsoft-red"
                  {...field} 
                  onBlur={handleAddressChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Status de la géolocalisation */}
      <div className="text-sm mt-2 py-1 px-2 rounded-md bg-neutral-50 border border-neutral-100">
        {isGeocoding ? (
          <div className="text-amber-600 flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Géolocalisation en cours...
          </div>
        ) : coordinates ? (
          <div className="text-green-600 flex items-center">
            <MapPin className="h-4 w-4 mr-1" /> Adresse localisée avec succès
          </div>
        ) : (
          <div className="text-neutral-500 flex items-center">
            <MapPin className="h-4 w-4 mr-1 opacity-50" /> Remplissez l'adresse complète pour la géolocaliser
          </div>
        )}
      </div>
    </div>
  );
}
