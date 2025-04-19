
// Tableau d'avatars par défaut
const defaultAvatars = [
  '/lovable-uploads/7d364374-717c-463c-b2b8-4c2766f8bd3d.png',
  '/lovable-uploads/a3e0e155-b74b-4c63-988b-ccf905611682.png',
  '/lovable-uploads/0aa43fed-e08e-44be-b49f-9897b6c76c2d.png',
  '/lovable-uploads/b29cdac5-4c87-4826-bb55-0a2c65161cc8.png',
  '/lovable-uploads/fefc072c-6098-4ae9-ab76-71e88b50e671.png'
];

/**
 * Retourne un avatar aléatoire parmi les avatars par défaut
 */
export const getRandomAvatar = (): string => {
  const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
  return defaultAvatars[randomIndex];
};
