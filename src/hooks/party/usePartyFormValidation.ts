
import { z } from "zod";

export const partyFormSchema = z.object({
  title: z.string().min(5, "Le titre doit comporter au moins 5 caractères"),
  description: z.string().min(20, "La description doit comporter au moins 20 caractères"),
  rules: z.string().min(10, "Les règles doivent comporter au moins 10 caractères"),
  startDateTime: z.date({ required_error: "La date et heure de début sont requises" }),
  endDateTime: z.date({ required_error: "La date et heure de fin sont requises" }),
  address: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  latitude: z.union([z.number(), z.string()]).optional(),
  longitude: z.union([z.number(), z.string()]).optional(),
  maxPlayers: z.string().min(1, "Le nombre maximum de joueurs est requis"),
  price: z.string()
    .refine(val => {
      const numVal = parseFloat(val);
      return !isNaN(numVal) && numVal >= 5;
    }, "Le prix minimum est de 5€"),
  gameType: z.string().min(1, "Le type de jeu est requis"),
  manualValidation: z.boolean().default(false),
  hasToilets: z.boolean().default(false),
  hasParking: z.boolean().default(false),
  hasEquipmentRental: z.boolean().default(false),
  aeg_fps_min: z.string().default("280"),
  aeg_fps_max: z.string().default("350"),
  dmr_fps_max: z.string().default("450"),
  eyeProtectionRequired: z.boolean().default(true),
  fullFaceProtectionRequired: z.boolean().default(false),
  hpaAllowed: z.boolean().default(true),
  polarStarAllowed: z.boolean().default(true),
  tracersAllowed: z.boolean().default(true),
  grenadesAllowed: z.boolean().default(true),
  smokesAllowed: z.boolean().default(false),
  pyroAllowed: z.boolean().default(false),
  terms: z.boolean().refine(val => val === true, "Vous devez accepter les conditions"),
  isPrivate: z.boolean().default(false),
}).refine((data) => {
  // Au moins une adresse OU des coordonnées doivent être fournies
  const hasAddress = data.address && data.city;
  const hasCoordinates = data.latitude && data.longitude;
  return hasAddress || hasCoordinates;
}, {
  message: "Vous devez fournir soit une adresse complète, soit des coordonnées géographiques",
  path: ["address"]
});

export type PartyFormValues = z.infer<typeof partyFormSchema>;
