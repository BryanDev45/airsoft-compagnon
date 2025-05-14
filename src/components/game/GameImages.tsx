
import React, { useState, useEffect, useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
  const [activeIndex, setActiveIndex] = useState(0);
  
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

  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index);
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
    <div className="mb-8">
      {displayImages.length > 0 && (
        <Carousel className="relative rounded-lg overflow-hidden">
          <CarouselContent>
            {displayImages.map((img, idx) => (
              <CarouselItem key={idx} className={activeIndex === idx ? 'block' : 'hidden'}>
                <AspectRatio ratio={16/9} className="bg-gray-100">
                  <div className="w-full h-full relative">
                    <img 
                      src={img} 
                      alt={`${title} - image ${idx + 1}`} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => handleImageError(idx, e)}
                    />
                    <div className="absolute inset-0 pointer-events-none border-8 border-white/10 shadow-[inset_0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[inset_0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300"></div>
                  </div>
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          {displayImages.length > 1 && (
            <>
              <CarouselPrevious 
                className="absolute left-2 bg-black/50 hover:bg-black/70 text-white border-none" 
                onClick={() => setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))}
              />
              <CarouselNext 
                className="absolute right-2 bg-black/50 hover:bg-black/70 text-white border-none"
                onClick={() => setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))}
              />
            </>
          )}
        </Carousel>
      )}
      
      {displayImages.length > 1 && (
        <div className="bg-white p-2 grid grid-cols-5 gap-2 mt-2 rounded-lg">
          {displayImages.slice(0, 5).map((img, idx) => (
            <div 
              key={idx}
              className={`h-20 relative cursor-pointer overflow-hidden rounded border-2 transition-all duration-200 ${activeIndex === idx ? 'border-airsoft-red scale-[1.03]' : 'border-transparent hover:border-airsoft-red/50'}`}
              onClick={() => handleThumbnailClick(idx)}
            >
              <img 
                src={img} 
                alt={`${title} ${idx + 1}`} 
                className="h-full w-full object-cover hover:opacity-90 transition-opacity"
                onError={(e) => handleImageError(idx, e)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameImages;
