
// Tableau d'avatars par défaut
const defaultAvatars = [
  '/lovable-uploads/270b167a-f6b5-4054-bdd3-4f8ddbb5b24c.png',
  '/lovable-uploads/f18a2322-4236-4191-8b1a-d9aebbcc7814.png',
  '/lovable-uploads/87eb202b-9864-4e57-b5db-0ff75c403e06.png'
];

/**
 * Retourne un avatar aléatoire parmi les avatars par défaut
 */
export const getRandomAvatar = (): string => {
  const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
  return defaultAvatars[randomIndex];
};
