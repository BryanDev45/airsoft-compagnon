
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useEmailRegistration } from './hooks/useEmailRegistration';
import NameFields from './components/NameFields';
import UserDetailsFields from './components/UserDetailsFields';
import PasswordFields from './components/PasswordFields';
import TermsField from './components/TermsField';

interface EmailRegistrationTabProps {
  isAnyLoading: boolean;
}

const EmailRegistrationTab = ({ isAnyLoading }: EmailRegistrationTabProps) => {
  const { form, loading, onSubmit, isDisabled } = useEmailRegistration(isAnyLoading);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <NameFields form={form} />
        <UserDetailsFields form={form} />
        <PasswordFields form={form} />
        <TermsField form={form} />
        
        <Button 
          type="submit" 
          className="w-full bg-airsoft-red hover:bg-red-700"
          disabled={isDisabled}
        >
          {loading ? 'Inscription en cours...' : 'S\'inscrire'}
        </Button>
      </form>
    </Form>
  );
};

export default EmailRegistrationTab;
