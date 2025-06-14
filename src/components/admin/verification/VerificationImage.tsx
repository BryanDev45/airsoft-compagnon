
import React from 'react';
import { Camera } from 'lucide-react';

interface VerificationImageProps {
  src?: string;
  alt: string;
  title: string;
}

export const VerificationImage = ({ src, alt, title }: VerificationImageProps) => {
  const [imageError, setImageError] = React.useState(false);

  const handleError = () => {
    setImageError(true);
  };

  return (
    <div className="space-y-2">
      <strong className="block">{title}:</strong>
      <div className="border rounded-lg overflow-hidden">
        {src && !imageError ? (
          <img 
            src={src} 
            alt={alt}
            className="w-full h-48 object-contain bg-gray-50"
            onError={handleError}
          />
        ) : (
          <div className="h-48 flex items-center justify-center bg-gray-100 text-gray-500">
            <div className="text-center">
              <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <div className="text-sm">
                {src ? "Image non disponible" : "Aucune image"}
              </div>
              {src && imageError && (
                <a 
                  href={src} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs mt-1 block"
                >
                  Ouvrir le lien
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
