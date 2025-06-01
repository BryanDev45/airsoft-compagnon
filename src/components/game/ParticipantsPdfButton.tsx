
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { usePdfDownload } from '@/hooks/usePdfDownload';
import { GameParticipant } from '@/types/game';

interface ParticipantsPdfButtonProps {
  gameTitle: string;
  gameDate: string;
  participants: GameParticipant[];
  disabled?: boolean;
}

const ParticipantsPdfButton: React.FC<ParticipantsPdfButtonProps> = ({
  gameTitle,
  gameDate,
  participants,
  disabled = false
}) => {
  const { downloadParticipantsList, isGenerating } = usePdfDownload();

  const handleDownload = () => {
    downloadParticipantsList(gameTitle, gameDate, participants);
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={disabled || isGenerating || participants.length === 0}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Download size={16} />
      {isGenerating ? 'Génération...' : 'Télécharger PDF'}
    </Button>
  );
};

export default ParticipantsPdfButton;
