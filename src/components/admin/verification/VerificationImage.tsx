
import React from 'react';
import { Camera, ZoomIn } from 'lucide-react';
import { VerificationImageModal } from './VerificationImageModal';

interface VerificationImageProps {
  src?: string;
  alt: string;
  title: string;
}

export const VerificationImage = ({ src, alt, title }: VerificationImageProps) => {
  const [imageError, setImageError] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Image load error for ${title}:`, {
      src,
      naturalHeight: event.currentTarget.naturalHeight,
      naturalWidth: event.currentTarget.naturalWidth
    });
    setImageError(true);
  };

  const handleLoad = () => {
    console.log(`Image loaded successfully for ${title}: ${src}`);
  };

  const handleImageClick = () => {
    if (src && !imageError) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <strong className="block">{title}:</strong>
        <div className="border rounded-lg overflow-hidden relative group">
          {src && !imageError ? (
            <div 
              className="relative cursor-pointer"
              onClick={handleImageClick}
            >
              <img 
                src={src} 
                alt={alt}
                className="w-full h-48 object-contain bg-gray-50 transition-opacity group-hover:opacity-90"
                onError={handleError}
                onLoad={handleLoad}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center bg-gray-100 text-gray-500">
              <div className="text-center">
                <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <div className="text-sm">
                  {src ? "Image non disponible" : "Aucune image"}
                </div>
                {src && imageError && (
                  <div className="mt-2 space-y-1">
                    <a 
                      href={src} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs block"
                    >
                      Ouvrir le lien
                    </a>
                    <div className="text-xs text-gray-400 break-all">
                      {src.length > 50 ? `${src.substring(0, 50)}...` : src}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <VerificationImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        src={src}
        alt={alt}
        title={title}
      />
    </>
  );
};
