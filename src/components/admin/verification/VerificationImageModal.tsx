
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera } from 'lucide-react';

interface VerificationImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src?: string;
  alt: string;
  title: string;
}

export const VerificationImageModal = ({ 
  isOpen, 
  onClose, 
  src, 
  alt, 
  title 
}: VerificationImageModalProps) => {
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setImageError(false);
    }
  }, [isOpen, src]);

  const handleError = () => {
    setImageError(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-6">
        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex justify-center">
          {src && !imageError ? (
            <img 
              src={src} 
              alt={alt}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
              onError={handleError}
            />
          ) : (
            <div className="h-96 w-96 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <div className="text-lg font-medium">
                  {src ? "Image non disponible" : "Aucune image"}
                </div>
                {src && imageError && (
                  <div className="mt-4 space-y-2">
                    <a 
                      href={src} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm block"
                    >
                      Ouvrir le lien direct
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
