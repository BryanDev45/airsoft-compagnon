
import React, { useState } from 'react';

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

  // Afficher une seule image si il n'y en a qu'une
  if (displayImages.length === 1) {
    return (
      <div className="w-full">
        <div className="w-full h-80 rounded-lg overflow-hidden">
          <img
            src={displayImages[0]}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
          />
        </div>
      </div>
    );
  }

  // Afficher la photo principale avec les miniatures en dessous
  return (
    <div className="w-full space-y-4">
      {/* Photo principale */}
      <div className="w-full h-80 rounded-lg overflow-hidden">
        <img
          src={displayImages[selectedImageIndex]}
          alt={`${title} - Image principale`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
        />
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
