
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { UserReport } from '@/components/admin/UserReportsTab';

interface UserReportActionsProps {
  report: UserReport;
  onResolveClick: (reportId: string) => void;
  onDismiss: (reportId: string) => void;
  onWarnClick: (report: UserReport) => void;
  isLoading: boolean;
}

const UserReportActions: React.FC<UserReportActionsProps> = ({
  report,
  onResolveClick,
  onDismiss,
  onWarnClick,
  isLoading
}) => {
  if (report.status !== 'pending') {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
      <Button
        onClick={() => onWarnClick(report)}
        size="sm"
        variant="outline"
        className="border-orange-500 text-orange-500 hover:bg-orange-50 w-full sm:w-auto text-xs sm:text-sm"
        disabled={isLoading}
      >
        <AlertTriangle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
        Avertir
      </Button>
      <Button
        onClick={() => onResolveClick(report.id)}
        size="sm"
        className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-xs sm:text-sm"
        disabled={isLoading}
      >
        Résoudre
      </Button>
      <Button
        onClick={() => onDismiss(report.id)}
        variant="outline"
        size="sm"
        className="w-full sm:w-auto text-xs sm:text-sm"
        disabled={isLoading}
      >
        Rejeter
      </Button>
    </div>
  );
};

export default UserReportActions;
