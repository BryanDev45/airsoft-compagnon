
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
      <AspectRatio ratio={16/9}>
        <img 
          src={displayImages[0]} 
          alt={title}
          className="object-cover w-full h-full"
        />
      </AspectRatio>
    );
  }

  return (
    <div className="relative">
      <Carousel className="w-full">
        <CarouselContent>
          {displayImages.map((image, index) => (
            <CarouselItem key={index}>
              <AspectRatio ratio={16/9}>
                <img 
                  src={image} 
                  alt={`${title} - Image ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 border-none text-white" />
        <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 border-none text-white" />
      </Carousel>
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        {displayImages.length} photos
      </div>
    </div>
  );
};

export default GameImageCarousel;
