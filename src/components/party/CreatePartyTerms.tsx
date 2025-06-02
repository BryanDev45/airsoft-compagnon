
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";

interface CreatePartyTermsProps {
  form: UseFormReturn<any>;
}

const CreatePartyTerms = ({ form }: CreatePartyTermsProps) => {
  return (
    <FormField
      control={form.control}
      name="terms"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              J'accepte les conditions générales et je certifie que cette partie respecte les lois en vigueur
            </FormLabel>
            <FormDescription className="text-xs text-gray-500 mt-1">
              Le prix minimum est de 5€ par joueur. 1€ de frais de gestion est inclus et revient à Airsoft Compagnon.
            </FormDescription>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default CreatePartyTerms;
