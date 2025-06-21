
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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t">
      {report.reporter_profile?.username && (
        <Button
          onClick={() => onViewProfile(report.reporter_profile?.username || '')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
        >
          <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="truncate">Profil du rapporteur</span>
        </Button>
      )}
      {report.reported_profile?.username && (
        <Button
          onClick={() => onViewProfile(report.reported_profile?.username || '')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
        >
          <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="truncate">Profil de l'utilisateur signalé</span>
        </Button>
      )}
    </div>
  );
};

export default UserReportProfileButtons;
