
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';
import { useFormContext } from "react-hook-form";

const ConsumablesSection = () => {
  const form = useFormContext();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-airsoft-red" />
          Consommables
        </CardTitle>
        <CardDescription>
          Définissez les consommables autorisés sur le terrain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField 
            control={form.control} 
            name="grenadesAllowed" 
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <FormLabel className="text-base">Grenades</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )} 
          />
          
          <FormField 
            control={form.control} 
            name="smokesAllowed" 
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <FormLabel className="text-base">Fumigènes</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )} 
          />
          
          <FormField 
            control={form.control} 
            name="pyroAllowed" 
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <FormLabel className="text-base">Pyrotechnie</FormLabel>
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

export default ConsumablesSection;
