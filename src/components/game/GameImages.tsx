
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface GameImagesProps {
  images: (string | null)[];
  title: string;
}

const GameImages: React.FC<GameImagesProps> = ({ images, title }) => {
  const defaultImage = "/lovable-uploads/dabf8bbc-44a7-4c03-bebe-009592f0c6c8.png";
  
  // Filtrer les images valides et ajouter l'image par défaut si aucune image
  const validImages = images.filter(Boolean) as string[];
  const displayImages = validImages.length > 0 ? validImages : [defaultImage];

  // Afficher une seule image si il n'y en a qu'une
  if (displayImages.length === 1) {
    return (
      <div className="w-full h-64 rounded-lg overflow-hidden">
        <img
          src={displayImages[0]}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Afficher le carrousel s'il y a plusieurs images
  return (
    <div className="w-full">
      <Carousel className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
        <CarouselContent>
          {displayImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`${title} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default GameImages;
