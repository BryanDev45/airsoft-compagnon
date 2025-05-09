
import React from 'react';

interface GameImagesProps {
  images: string[];
  title: string;
}

const GameImages: React.FC<GameImagesProps> = ({ images, title }) => {
  const defaultImages = [
    "https://images.unsplash.com/photo-1624881513483-c1f3760fe7ad?q=80&w=2070&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1624881514789-5a8a7a82b9b0?q=80&w=2070&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1625008928888-27fde18fd355?q=80&w=2069&auto=format&fit=crop"
  ];

  console.log("GameImages - Images reçues:", images);
  
  // Filtrer les images null, vides ou undefined
  const filteredImages = images.filter(img => img && img.trim() !== '');
  console.log("GameImages - Images filtrées:", filteredImages);
  
  // N'utiliser les images par défaut que si aucune image valide n'est fournie
  const displayImages = filteredImages.length > 0 ? filteredImages : defaultImages;

  return (
    <div className="rounded-lg overflow-hidden mb-8">
      {displayImages.length > 0 && (
        <img 
          src={displayImages[0]} 
          alt={title} 
          className="w-full h-[300px] object-cover"
          onError={(e) => {
            console.error("Erreur de chargement de l'image:", displayImages[0]);
            e.currentTarget.src = defaultImages[0];
          }}
        />
      )}
      
      {displayImages.length > 1 && (
        <div className="bg-white p-2 grid grid-cols-3 gap-2">
          {displayImages.slice(1, 4).map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              alt={`${title} ${idx + 1}`} 
              className="h-20 w-full object-cover rounded"
              onError={(e) => {
                console.error("Erreur de chargement de l'image:", img);
                e.currentTarget.src = defaultImages[Math.min(idx+1, defaultImages.length-1)];
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GameImages;
