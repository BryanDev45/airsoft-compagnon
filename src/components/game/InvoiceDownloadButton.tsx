
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { GameData } from '@/types/game';
import { Profile } from '@/types/profile';
import { useInvoiceDownload } from '@/hooks/useInvoiceDownload';

interface InvoiceDownloadButtonProps {
  gameData: GameData;
  userProfile: Profile | null;
  isRegistered: boolean;
  className?: string;
}

const InvoiceDownloadButton: React.FC<InvoiceDownloadButtonProps> = ({
  gameData,
  userProfile,
  isRegistered,
  className = ""
}) => {
  const { downloadInvoice, isGenerating } = useInvoiceDownload();

  // Ne pas afficher le bouton si l'utilisateur n'est pas inscrit
  if (!isRegistered) {
    return null;
  }

  const handleDownload = () => {
    console.log('InvoiceDownloadButton: Click detected', { gameData, userProfile });
    downloadInvoice(gameData, userProfile);
  };

  return (
    <Button
      variant="outline"
      onClick={handleDownload}
      disabled={isGenerating}
      className={`flex items-center gap-2 ${className}`}
    >
      {isGenerating ? (
        <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      ) : (
        <Download size={16} />
      )}
      {isGenerating ? 'Génération...' : 'Télécharger la facture'}
    </Button>
  );
};

export default InvoiceDownloadButton;
