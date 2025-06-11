
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GameData } from '@/types/game';

// Form schema definition
const gameFormSchema = z.object({
  title: z.string().min(5, "Le titre doit comporter au moins 5 caractères"),
  description: z.string().min(20, "La description doit comporter au moins 20 caractères"),
  rules: z.string().min(10, "Les règles doivent comporter au moins 10 caractères"),
  startDateTime: z.date({ required_error: "La date et heure de début sont requises" }),
  endDateTime: z.date({ required_error: "La date et heure de fin sont requises" }),
  address: z.string().min(5, "L'adresse doit comporter au moins 5 caractères"),
  city: z.string().min(2, "La ville est requise"),
  zipCode: z.string().min(5, "Le code postal est requis"),
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
  isPrivate: z.boolean().default(false),
});

export type GameFormValues = z.infer<typeof gameFormSchema>;

export const useGameEditForm = (gameData: GameData | null) => {
  const form = useForm<GameFormValues>({
    resolver: zodResolver(gameFormSchema),
    defaultValues: {
      title: "",
      description: "",
      rules: "",
      startDateTime: new Date(),
      endDateTime: new Date(),
      address: "",
      city: "",
      zipCode: "",
      maxPlayers: "20",
      price: "5",
      gameType: "",
      manualValidation: false,
      hasToilets: false,
      hasParking: false,
      hasEquipmentRental: false,
      aeg_fps_min: "280",
      aeg_fps_max: "350",
      dmr_fps_max: "450",
      eyeProtectionRequired: true,
      fullFaceProtectionRequired: false,
      hpaAllowed: true,
      polarStarAllowed: true,
      tracersAllowed: true,
      grenadesAllowed: true,
      smokesAllowed: false,
      pyroAllowed: false,
      isPrivate: false
    }
  });

  // Initialize form when gameData is loaded
  if (gameData) {
    const startDateTime = new Date(`${gameData.date}T${gameData.start_time}`);
    const endDateToUse = gameData.end_date || gameData.date;
    const endDateTime = new Date(`${endDateToUse}T${gameData.end_time}`);
    
    if (endDateTime < startDateTime && !gameData.end_date) {
      endDateTime.setDate(endDateTime.getDate() + 1);
    }

    form.reset({
      title: gameData.title,
      description: gameData.description,
      rules: gameData.rules,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      address: gameData.address,
      city: gameData.city,
      zipCode: gameData.zip_code,
      maxPlayers: gameData.max_players.toString(),
      price: gameData.price ? gameData.price.toString() : "5",
      gameType: gameData.game_type,
      manualValidation: gameData.manual_validation,
      hasToilets: gameData.has_toilets,
      hasParking: gameData.has_parking,
      hasEquipmentRental: gameData.has_equipment_rental,
      aeg_fps_min: gameData.aeg_fps_min ? gameData.aeg_fps_min.toString() : "280",
      aeg_fps_max: gameData.aeg_fps_max ? gameData.aeg_fps_max.toString() : "350",
      dmr_fps_max: gameData.dmr_fps_max ? gameData.dmr_fps_max.toString() : "450",
      eyeProtectionRequired: gameData.eye_protection_required,
      fullFaceProtectionRequired: gameData.full_face_protection_required,
      hpaAllowed: gameData.hpa_allowed,
      polarStarAllowed: gameData.polarstar_allowed,
      tracersAllowed: gameData.tracers_allowed,
      grenadesAllowed: gameData.grenades_allowed,
      smokesAllowed: gameData.smokes_allowed,
      pyroAllowed: gameData.pyro_allowed,
      isPrivate: gameData.is_private
    });
  }

  return { form };
};
