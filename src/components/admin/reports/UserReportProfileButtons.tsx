
import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface UserReport {
  id: string;
  status: string;
  reporter_profile: {
    username: string;
  } | null;
  reported_profile: {
    username: string;
  } | null;
}

interface UserReportProfileButtonsProps {
  report: UserReport;
  onViewProfile: (username: string) => void;
}

const UserReportProfileButtons: React.FC<UserReportProfileButtonsProps> = ({
  report,
  onViewProfile
}) => {
  return (
    <div className="flex items-center gap-2 pt-2 border-t">
      {report.reporter_profile?.username && (
        <Button
          onClick={() => onViewProfile(report.reporter_profile?.username || '')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          Profil du rapporteur
        </Button>
      )}
      {report.reported_profile?.username && (
        <Button
          onClick={() => onViewProfile(report.reported_profile?.username || '')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          Profil de l'utilisateur signalé
        </Button>
      )}
    </div>
  );
};

export default UserReportProfileButtons;
