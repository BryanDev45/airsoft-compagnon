
import { z } from 'zod';

export const teamSchema = z.object({
  name: z.string().min(3, { message: "Le nom de l'équipe doit contenir au moins 3 caractères" }),
  description: z.string().optional(),
  isAssociation: z.boolean().optional(),
  contact: z.string().email({ message: "Email de contact invalide" }).or(z.literal('')).optional(),
  location: z.string().optional(),
});

export type TeamFormData = z.infer<typeof teamSchema>;
