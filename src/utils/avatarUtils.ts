
/**
 * Modèles d'avatars par défaut, utilisant les nouvelles images
 */
const defaultAvatars = [
  '/lovable-uploads/52a37106-d8af-4a71-9d67-4d69bd884c8f.png',
  '/lovable-uploads/79637843-91ff-413e-80fc-ac24713183c3.png',
  '/lovable-uploads/dbca34c0-4c90-48de-b573-3ee4118da4d1.png',
  '/lovable-uploads/49b5c95b-338d-461a-a797-2eef2ab61a57.png',
  '/lovable-uploads/b4ffe288-3017-4672-a679-cb442d6f00e0.png',
  '/lovable-uploads/dc20bd05-193b-4100-bf42-cfbbb20433ad.png',
];

/**
 * Retourne un avatar aléatoire parmi la liste.
 */
export const getRandomAvatar = (): string => {
  const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
  return defaultAvatars[randomIndex];
};

/**
 * Retourne la liste complète des avatars par défaut pour la sélection utilisateur.
 */
export const getAllDefaultAvatars = (): string[] => [...defaultAvatars];
