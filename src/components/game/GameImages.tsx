
import React, { useState, useEffect, useRef } from 'react';

interface GameImagesProps {
  images: string[];
  title: string;
}

const GameImages: React.FC<GameImagesProps> = ({ images, title }) => {
  // Images par défaut à utiliser si aucune image valide n'est fournie
  const defaultImages = [
    "https://images.unsplash.com/photo-1624881513483-c1f3760fe7ad?q=80&w=2070&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1624881514789-5a8a7a82b9b0?q=80&w=2070&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1625008928888-27fde18fd355?q=80&w=2069&auto=format&fit=crop"
  ];

  // État local pour stocker les images filtrées
  const [displayImages, setDisplayImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Référence pour vérifier si le composant est monté
  const isMounted = useRef(true);
  
  // Configurer isMounted lors du montage/démontage
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Filtrer les images à chaque changement du tableau images
  useEffect(() => {
    setIsLoading(true);
    console.log("GameImages - Images reçues:", images);
    
    // Vérifier si images est défini et non nul
    if (!images || !Array.isArray(images)) {
      console.log("GameImages - Images non valides, utilisation des images par défaut");
      if (isMounted.current) {
        setDisplayImages(defaultImages);
        setIsLoading(false);
      }
      return;
    }
    
    // Filtrer les images null, undefined ou vides
    const filteredImages = images.filter(img => img && img.trim() !== '');
    console.log("GameImages - Images filtrées:", filteredImages);
    
    // N'utiliser les images par défaut que si aucune image valide n'est fournie
    if (isMounted.current) {
      setDisplayImages(filteredImages.length > 0 ? filteredImages : defaultImages);
      setIsLoading(false);
    }
  }, [images]);

  // Gérer les erreurs de chargement d'image
  const handleImageError = (index: number, e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Erreur de chargement de l'image ${index}:`, displayImages[index]);
    
    // Remplacer l'image qui a échoué par une image par défaut
    const fallbackIndex = Math.min(index, defaultImages.length - 1);
    e.currentTarget.src = defaultImages[fallbackIndex];
  };

  // Si aucune image n'est disponible ou si le chargement est en cours, afficher un placeholder
  if (isLoading) {
    return (
      <div className="rounded-lg overflow-hidden mb-8 bg-gray-200 animate-pulse">
        <div className="w-full h-[300px]"></div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden mb-8">
      {displayImages.length > 0 && (
        <img 
          src={displayImages[0]} 
          alt={title} 
          className="w-full h-[300px] object-cover"
          onError={(e) => handleImageError(0, e)}
        />
      )}
      
      {displayImages.length > 1 && (
        <div className="bg-white p-2 grid grid-cols-4 gap-2">
          {displayImages.slice(1, 5).map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              alt={`${title} ${idx + 1}`} 
              className="h-20 w-full object-cover rounded"
              onError={(e) => handleImageError(idx + 1, e)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GameImages;
