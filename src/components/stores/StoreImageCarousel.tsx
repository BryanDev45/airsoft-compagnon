
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StoreImageCarouselProps {
  images: string[];
  storeName: string;
}

const StoreImageCarousel: React.FC<StoreImageCarouselProps> = ({ images, storeName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filtrer les images non nulles et non vides, en enlevant les doublons
  const validImages = Array.from(new Set(
    images.filter(img => img && img.trim() !== '' && img !== 'null')
  ));
  
  console.log('StoreImageCarousel - Valid images:', validImages);
  
  if (validImages.length === 0) {
    return (
      <div className="relative h-48 bg-gray-200 flex items-center justify-center">
        <img
          src="/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png"
          alt={storeName}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Error loading default image for store:', storeName);
          }}
        />
      </div>
    );
  }

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative h-48 group">
      <img
        src={validImages[currentImageIndex]}
        alt={`${storeName} - Image ${currentImageIndex + 1}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error('Error loading image:', validImages[currentImageIndex], 'for store:', storeName);
          // Fallback to default image
          const target = e.target as HTMLImageElement;
          target.src = "/lovable-uploads/b4788da2-5e76-429d-bfca-8587c5ca68aa.png";
        }}
      />
      
      {validImages.length > 1 && (
        <>
          {/* Bouton précédent */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Bouton suivant */}
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Indicateurs de points */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {validImages.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StoreImageCarousel;
