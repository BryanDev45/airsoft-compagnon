
export const validateFile = (file: File, fileName: string) => {
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error(`Le fichier ${fileName} est trop volumineux (max 10MB)`);
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Type de fichier non autorisé: ${file.type}. Utilisez JPG, PNG ou WebP.`);
  }
};

export const generateFileName = (originalFile: File, prefix: string, timestamp: number): string => {
  const extension = originalFile.name.split('.').pop();
  return `${prefix}_${timestamp}.${extension}`;
};
