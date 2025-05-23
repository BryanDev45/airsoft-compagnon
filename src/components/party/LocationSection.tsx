
import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from 'lucide-react';
import { useFormContext } from "react-hook-form";
import { LocationSectionProps } from '@/types/party';

const LocationSection: React.FC<LocationSectionProps> = ({ updateFormData, initialData }) => {
  const form = useFormContext();
  
  useEffect(() => {
    if (initialData && updateFormData) {
      updateFormData('location', {
        address: initialData.address,
        city: initialData.city,
        zipCode: initialData.zip_code
      });
    }
  }, [initialData, updateFormData]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-airsoft-red" />
          Lieu
        </CardTitle>
        <CardDescription>
          Indiquez l'adresse précise où se déroule la partie
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField 
          control={form.control} 
          name="address" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Input placeholder="Adresse du terrain" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField 
            control={form.control} 
            name="city" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ville</FormLabel>
                <FormControl>
                  <Input placeholder="Ville" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          
          <FormField 
            control={form.control} 
            name="zipCode" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code postal</FormLabel>
                <FormControl>
                  <Input placeholder="Code postal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSection;
