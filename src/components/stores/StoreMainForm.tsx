
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import StoreLocationSection from './StoreLocationSection';
import StoreContactSection from './StoreContactSection';

interface StoreFormData {
  name: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
}

interface StoreMainFormProps {
  form: UseFormReturn<StoreFormData>;
  isGeocoding: boolean;
  coordinates: [number, number] | null;
  handleAddressChange: () => void;
}

export default function StoreMainForm({
  form,
  isGeocoding,
  coordinates,
  handleAddressChange
}: StoreMainFormProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom du magasin *</FormLabel>
            <FormControl>
              <Input {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <StoreLocationSection
        form={form}
        isGeocoding={isGeocoding}
        coordinates={coordinates}
        handleAddressChange={handleAddressChange}
      />

      <StoreContactSection form={form} />
    </div>
  );
}
