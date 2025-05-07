
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from 'lucide-react';
import { useFormContext } from "react-hook-form";

const PowerLimitsSection = () => {
  const form = useFormContext();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-airsoft-red" />
          Limites de puissance
        </CardTitle>
        <CardDescription>
          Définissez les limites de FPS pour votre partie
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">AEG / GBB</h3>
            <div className="flex space-x-4">
              <FormField 
                control={form.control} 
                name="aeg_fps_min" 
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>FPS Min</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" max="500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              <FormField 
                control={form.control} 
                name="aeg_fps_max" 
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>FPS Max</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" max="500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
            </div>
          </div>
          
          <FormField 
            control={form.control} 
            name="dmr_fps_max" 
            render={({ field }) => (
              <FormItem className="my-[45px]">
                <FormLabel className="rounded-none">Sniper / DMR (FPS Max)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="600" className="my-[52px]" {...field} />
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

export default PowerLimitsSection;
