
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Phone, Mail, Globe } from 'lucide-react';

interface StoreContactSectionProps {
  form: UseFormReturn<any>;
}

export default function StoreContactSection({
  form
}: StoreContactSectionProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" /> Téléphone
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="01 23 45 67 89" 
                className="rounded-md border-neutral-300 focus:border-airsoft-red focus:ring-airsoft-red"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" /> Email
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="contact@airsoftshop.fr" 
                className="rounded-md border-neutral-300 focus:border-airsoft-red focus:ring-airsoft-red"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" /> Site web
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="https://www.airsoftshop.fr" 
                className="rounded-md border-neutral-300 focus:border-airsoft-red focus:ring-airsoft-red"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
