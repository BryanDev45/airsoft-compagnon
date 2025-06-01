
import React, { useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface GameImageCarouselProps {
  images: string[];
  title: string;
}

const GameImageCarousel: React.FC<GameImageCarouselProps> = ({ images, title }) => {
  const defaultImage = "/lovable-uploads/dabf8bbc-44a7-4c03-bebe-009592f0c6c8.png";
  const displayImages = images.length > 0 ? images : [defaultImage];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="space-y-3">
      {/* Photo principale */}
      <div className="relative">
        <AspectRatio ratio={16/9}>
          <img 
            src={displayImages[selectedImageIndex]} 
            alt={`${title} - Image principale`}
            className="object-cover w-full h-full rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
          />
        </AspectRatio>
        {displayImages.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {selectedImageIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Miniatures en dessous */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all duration-200 ${
                selectedImageIndex === index 
                  ? 'border-airsoft-red shadow-md' 
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img 
                src={image} 
                alt={`${title} - Miniature ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameImageCarousel;
