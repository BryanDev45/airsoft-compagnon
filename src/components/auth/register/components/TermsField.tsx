
import React from 'react';
import { Link } from 'react-router-dom';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { RegisterFormData } from '../registerSchema';

interface TermsFieldProps {
  form: UseFormReturn<RegisterFormData>;
}

const TermsField = ({ form }: TermsFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="terms"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="text-sm font-normal">
              J'accepte les{' '}
              <Link to="/terms-of-use" className="text-airsoft-red hover:underline">
                conditions d'utilisation
              </Link>
              {' '}et la{' '}
              <Link to="/privacy-policy" className="text-airsoft-red hover:underline">
                politique de confidentialité
              </Link>
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default TermsField;
