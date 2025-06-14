
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RegisterFormData } from '../registerSchema';

interface PasswordFieldsProps {
  form: UseFormReturn<RegisterFormData>;
}

const PasswordFields = ({ form }: PasswordFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mot de passe</FormLabel>
            <FormControl>
              <Input 
                placeholder="••••••" 
                type="password" 
                autoComplete="new-password"
                {...field} 
              />
            </FormControl>
            <FormMessage />
            <p className="text-xs text-gray-500 mt-1">
              Le mot de passe doit contenir au minimum une minuscule, une majuscule, 
              un chiffre et un caractère spécial.
            </p>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="confirm_password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirmer le mot de passe</FormLabel>
            <FormControl>
              <Input 
                placeholder="••••••" 
                type="password" 
                autoComplete="new-password"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PasswordFields;
