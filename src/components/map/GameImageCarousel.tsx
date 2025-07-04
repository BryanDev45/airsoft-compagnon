
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface GameImageCarouselProps {
  images: string[];
  title: string;
}

const GameImageCarousel: React.FC<GameImageCarouselProps> = ({ images, title }) => {
  const defaultImage = "/lovable-uploads/dabf8bbc-44a7-4c03-bebe-009592f0c6c8.png";
  const displayImages = images.length > 0 ? images : [defaultImage];

  if (displayImages.length === 1) {
    return (
      <AspectRatio ratio={16/9} className="w-full overflow-hidden">
        <img 
          src={displayImages[0]} 
          alt={title}
          className="object-cover w-full h-full"
        />
      </AspectRatio>
    );
  }

  return (
    <div className="relative w-full h-full group overflow-hidden">
      <Carousel className="w-full h-full">
        <CarouselContent className="h-full">
          {displayImages.map((image, index) => (
            <CarouselItem key={index} className="h-full">
              <AspectRatio ratio={16/9} className="w-full h-full overflow-hidden">
                <img 
                  src={image} 
                  alt={`${title} - Image ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Boutons de navigation avec z-index approprié */}
        <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-white/90 hover:bg-white border-none text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
        <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-white/90 hover:bg-white border-none text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
      </Carousel>
      
      {/* Indicateur du nombre de photos avec z-index approprié */}
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
        {displayImages.length} photos
      </div>
    </div>
  );
};

export default GameImageCarousel;
