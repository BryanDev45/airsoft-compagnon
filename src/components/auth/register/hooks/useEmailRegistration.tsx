
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema, type RegisterFormData } from '../registerSchema';

export const useEmailRegistration = (isAnyLoading: boolean) => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      birth_date: '',
      password: '',
      confirm_password: '',
      terms: false,
    },
  });

  const onSubmit = async (values: RegisterFormData) => {
    setLoading(true);
    try {
      // Préparation des données utilisateur pour l'inscription
      const userData = {
        username: values.username,
        firstname: values.firstname,
        lastname: values.lastname,
        birth_date: values.birth_date,
      };

      await register(values.email, values.password, userData);
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    onSubmit,
    isDisabled: isAnyLoading || loading
  };
};
