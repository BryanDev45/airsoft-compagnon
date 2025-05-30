
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StoreTypeSelectorProps {
  form: UseFormReturn<any>;
}

const StoreTypeSelector: React.FC<StoreTypeSelectorProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="storeType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de magasin *</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type de magasin" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="physical">Magasin physique</SelectItem>
              <SelectItem value="online">Magasin en ligne</SelectItem>
              <SelectItem value="both">Physique et en ligne</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StoreTypeSelector;
