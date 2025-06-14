
import React from 'react';
import { Camera } from 'lucide-react';

interface VerificationImageProps {
  src?: string;
  alt: string;
  title: string;
}

export const VerificationImage = ({ src, alt, title }: VerificationImageProps) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent && src) {
      parent.innerHTML = `
        <div class="h-48 flex items-center justify-center bg-gray-100 text-gray-500">
          <div class="text-center">
            <div class="mb-2">⚠️</div>
            <div class="text-sm">Image non disponible</div>
            <a href="${src}" target="_blank" class="text-blue-600 hover:underline text-xs">Ouvrir le lien</a>
          </div>
        </div>
      `;
    }
  };

  return (
    <div className="space-y-2">
      <strong className="block">{title}:</strong>
      <div className="border rounded-lg overflow-hidden">
        {src ? (
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
              <div className="text-sm">Aucune photo du visage</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
