
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface EventImageCarouselProps {
  images: string[];
  title: string;
}

const EventImageCarousel: React.FC<EventImageCarouselProps> = ({ images, title }) => {
  // Filtrer les images valides
  const validImages = images.filter(Boolean);
  
  // Si une seule image ou aucune image, afficher une image simple
  if (validImages.length <= 1) {
    const defaultImage = "/lovable-uploads/8c35b648-4640-4896-943d-3e329c86a080.png";
    return (
      <div className="relative h-48 overflow-hidden">
        <img 
          src={validImages[0] || defaultImage} 
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className="relative h-48 overflow-hidden">
      <Carousel className="w-full h-full">
        <CarouselContent>
          {validImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="h-48">
                <img 
                  src={image} 
                  alt={`${title} - Image ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {validImages.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 hover:bg-black/70 text-white" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 hover:bg-black/70 text-white" />
          </>
        )}
        
        {/* Indicateur de nombre d'images */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {validImages.length} photos
        </div>
      </Carousel>
    </div>
  );
};

export default EventImageCarousel;
