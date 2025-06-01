
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

  if (displayImages.length === 1) {
    return (
      <div className="w-full">
        <AspectRatio ratio={16/9}>
          <img 
            src={displayImages[0]} 
            alt={title}
            className="object-cover w-full h-full rounded-lg transition-transform duration-300 hover:scale-105"
          />
        </AspectRatio>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Image principale */}
      <div className="relative">
        <AspectRatio ratio={16/9}>
          <img 
            src={displayImages[selectedImageIndex]} 
            alt={`${title} - Image ${selectedImageIndex + 1}`}
            className="object-cover w-full h-full rounded-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
          />
        </AspectRatio>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {selectedImageIndex + 1} / {displayImages.length}
        </div>
      </div>

      {/* Miniatures */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {displayImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={`flex-shrink-0 transition-all duration-200 hover:scale-105 ${
              index === selectedImageIndex 
                ? 'ring-2 ring-airsoft-red shadow-lg' 
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <div className="w-20 h-14 rounded-md overflow-hidden">
              <img 
                src={image} 
                alt={`${title} - Miniature ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameImageCarousel;
