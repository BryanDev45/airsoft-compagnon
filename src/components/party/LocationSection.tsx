
import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from 'lucide-react';
import { useFormContext } from "react-hook-form";
import { LocationSectionProps } from "@/types/party";

const LocationSection = ({ updateFormData, initialData }: LocationSectionProps) => {
  const form = useFormContext();
  
  // If we're in edit mode with initialData, update the form
  useEffect(() => {
    if (initialData) {
      // Update form with initialData if available
      form.setValue('address', initialData.address || '');
      form.setValue('city', initialData.city || '');
      form.setValue('zipCode', initialData.zipCode || '');
    }
  }, [initialData, form]);

  // Handle form changes to update parent component
  const handleFieldChange = (field: string, value: any) => {
    if (updateFormData) {
      updateFormData('location', { [field]: value });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-airsoft-red" />
          Lieu
        </CardTitle>
        <CardDescription>
          L'adresse où se déroulera votre partie
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
                <Input 
                  placeholder="Adresse du terrain" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange('address', e.target.value);
                  }}
                />
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
                  <Input 
                    placeholder="Ville" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange('city', e.target.value);
                    }}
                  />
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
                  <Input 
                    placeholder="Code postal" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange('zipCode', e.target.value);
                    }}
                  />
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
