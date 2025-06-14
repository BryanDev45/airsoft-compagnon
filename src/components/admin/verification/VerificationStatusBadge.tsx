
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';

interface VerificationStatusBadgeProps {
  status: string;
}

export const VerificationStatusBadge = ({ status }: VerificationStatusBadgeProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <CheckCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvée';
      case 'rejected': return 'Rejetée';
      default: return 'En attente';
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getStatusIcon(status)}
      <Badge className={getStatusBadge(status)}>
        {getStatusText(status)}
      </Badge>
    </div>
  );
};
