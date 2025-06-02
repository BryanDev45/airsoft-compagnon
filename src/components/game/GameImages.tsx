
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameImagesProps {
  images: (string | null)[];
  title: string;
}

const GameImages: React.FC<GameImagesProps> = ({ images, title }) => {
  const defaultImage = "/lovable-uploads/dabf8bbc-44a7-4c03-bebe-009592f0c6c8.png";
  
  // Filtrer les images valides et ajouter l'image par défaut si aucune image
  const validImages = images.filter(Boolean) as string[];
  const displayImages = validImages.length > 0 ? validImages : [defaultImage];
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const goToPrevious = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) => 
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  // Afficher une seule image si il n'y en a qu'une
  if (displayImages.length === 1) {
    return (
      <div className="w-full">
        <div className="w-full h-96 rounded-lg overflow-hidden">
          <img
            src={displayImages[0]}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
          />
        </div>
      </div>
    );
  }

  // Afficher la photo principale avec les miniatures en dessous et les flèches de navigation
  return (
    <div className="w-full space-y-4">
      {/* Photo principale avec flèches de navigation */}
      <div className="relative w-full h-96 rounded-lg overflow-hidden group">
        <img
          src={displayImages[selectedImageIndex]}
          alt={`${title} - Image principale`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
        />
        
        {/* Flèche gauche */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {/* Flèche droite */}
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
          onClick={goToNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        {/* Indicateur de position */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {selectedImageIndex + 1} / {displayImages.length}
        </div>
      </div>
      
      {/* Miniatures */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {displayImages.map((image, index) => (
          <div
            key={index}
            className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
              index === selectedImageIndex 
                ? 'border-airsoft-red shadow-lg' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedImageIndex(index)}
          >
            <img
              src={image}
              alt={`${title} - Miniature ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-200 hover:scale-110"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameImages;
