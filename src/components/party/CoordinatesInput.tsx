
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

const CoordinatesInput: React.FC = () => {
  const form = useFormContext();
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField 
        control={form.control} 
        name="latitude" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Latitude</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.000001"
                placeholder="Ex: 48.8566" 
                {...field}
                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : '')}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
      
      <FormField 
        control={form.control} 
        name="longitude" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Longitude</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.000001"
                placeholder="Ex: 2.3522" 
                {...field}
                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : '')}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
    </div>
  );
};

export default CoordinatesInput;
