
import React from 'react';
import { MapPin } from 'lucide-react';
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
    <>
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse *</FormLabel>
            <FormControl>
              <Input 
                placeholder="123 rue des Airsofteurs" 
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
              <FormLabel>Code postal *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="75001" 
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
              <FormLabel>Ville *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Paris" 
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
      <div className="text-sm">
        {isGeocoding ? (
          <div className="text-amber-600 flex items-center">
            <span className="animate-spin mr-2">⟳</span> Géolocalisation en cours...
          </div>
        ) : coordinates ? (
          <div className="text-green-600 flex items-center">
            <MapPin className="h-4 w-4 mr-1" /> Adresse localisée avec succès
          </div>
        ) : (
          <div className="text-gray-500">
            Remplissez l'adresse complète pour la géolocaliser
          </div>
        )}
      </div>
    </>
  );
}
