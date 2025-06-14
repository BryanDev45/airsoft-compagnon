
import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$/;

export const registerSchema = z.object({
  username: z.string().min(3, {
    message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères.',
  }),
  firstname: z.string().min(2, {
    message: 'Le prénom doit contenir au moins 2 caractères.',
  }),
  lastname: z.string().min(2, {
    message: 'Le nom doit contenir au moins 2 caractères.',
  }),
  email: z.string().email({
    message: 'Veuillez entrer une adresse email valide.',
  }),
  birth_date: z.string().refine(value => {
    const date = new Date(value);
    const today = new Date();
    const ageDiff = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();
    
    // Calcul de l'âge réel (prend en compte les mois et jours)
    const age = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) 
      ? ageDiff - 1 
      : ageDiff;
      
    return age >= 18;
  }, {
    message: 'Vous devez avoir au moins 18 ans pour vous inscrire.',
  }),
  password: z.string()
    .min(6, {
      message: 'Le mot de passe doit contenir au moins 6 caractères.',
    })
    .refine(value => passwordRegex.test(value), {
      message: 'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial.',
    }),
  confirm_password: z.string(),
  terms: z.boolean().refine(value => value === true, {
    message: 'Vous devez accepter les conditions d\'utilisation.',
  }),
}).refine(data => data.password === data.confirm_password, {
  message: 'Les mots de passe ne correspondent pas.',
  path: ['confirm_password'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
