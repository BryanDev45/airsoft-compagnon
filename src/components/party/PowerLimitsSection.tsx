
import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from 'lucide-react';
import { useFormContext } from "react-hook-form";
import { PowerLimitsSectionProps } from '@/types/party';

const PowerLimitsSection: React.FC<PowerLimitsSectionProps> = ({ updateFormData, initialData }) => {
  const form = useFormContext();
  
  useEffect(() => {
    if (initialData && updateFormData) {
      updateFormData('powerLimits', {
        aeg_fps_min: initialData.aeg_fps_min,
        aeg_fps_max: initialData.aeg_fps_max,
        dmr_fps_max: initialData.dmr_fps_max
      });
    }
  }, [initialData, updateFormData]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-airsoft-red" />
          Limites de puissance
        </CardTitle>
        <CardDescription>
          Définissez les limites de puissance des répliques pour cette partie
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField 
            control={form.control} 
            name="aeg_fps_min" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>FPS minimum AEG</FormLabel>
                <FormControl>
                  <Input type="number" {...field} min="0" />
                </FormControl>
                <FormDescription className="text-xs">
                  FPS minimum pour les répliques automatiques
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} 
          />
          
          <FormField 
            control={form.control} 
            name="aeg_fps_max" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>FPS maximum AEG</FormLabel>
                <FormControl>
                  <Input type="number" {...field} min="0" />
                </FormControl>
                <FormDescription className="text-xs">
                  FPS maximum pour les répliques automatiques
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} 
          />
          
          <FormField 
            control={form.control} 
            name="dmr_fps_max" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>FPS maximum DMR</FormLabel>
                <FormControl>
                  <Input type="number" {...field} min="0" />
                </FormControl>
                <FormDescription className="text-xs">
                  FPS maximum pour les répliques DMR
                </FormDescription>
                <FormMessage />
              </FormItem>
            )} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PowerLimitsSection;
