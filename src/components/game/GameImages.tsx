
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
  // Filtrer les images valides
  const validImages = images.filter(Boolean) as string[];

  // Ne pas afficher le carrousel s'il n'y a pas d'images
  if (validImages.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Aucune image disponible</p>
      </div>
    );
  }

  // Afficher une seule image si il n'y en a qu'une
  if (validImages.length === 1) {
    return (
      <div className="w-full h-64 rounded-lg overflow-hidden">
        <img
          src={validImages[0]}
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
          {validImages.map((image, index) => (
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
