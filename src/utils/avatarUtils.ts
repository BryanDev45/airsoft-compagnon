
/**
 * Modèles d'avatars par défaut, y compris les nouveaux ajouts fournis.
 */
const defaultAvatars = [
  '/lovable-uploads/7d364374-717c-463c-b2b8-4c2766f8bd3d.png',
  '/lovable-uploads/a3e0e155-b74b-4c63-988b-ccf905611682.png',
  '/lovable-uploads/0aa43fed-e08e-44be-b49f-9897b6c76c2d.png',
  '/lovable-uploads/b29cdac5-4c87-4826-bb55-0a2c65161cc8.png',
  '/lovable-uploads/fefc072c-6098-4ae9-ab76-71e88b50e671.png',
  '/lovable-uploads/05868421-478d-4d11-bafa-d3b5b3c61435.png',
  '/lovable-uploads/d69d0b58-2ea2-41c9-853d-3707e3caf442.png',
  '/lovable-uploads/0427be85-8664-49fc-b134-28faa8f9133f.png',
  '/lovable-uploads/11b1f0a2-300c-458c-9c0a-1d601765963a.png',
  '/lovable-uploads/7ccff25b-48f3-4bfe-b83d-6680ad3b43e7.png',
  '/lovable-uploads/d45d9470-0a9c-4fa4-9673-c69fe27088ea.png',
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
