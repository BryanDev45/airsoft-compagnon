
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingStateProps {
  message: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message }) => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className="h-12 w-12 border-4 border-airsoft-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-500">{message}</p>
    </div>
  </div>
);

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title, description, onRetry }) => (
  <div className="flex items-center justify-center py-12 flex-col">
    <div className="text-center">
      <AlertCircle className="h-12 w-12 text-airsoft-red mx-auto mb-4" />
      <p className="text-gray-700 mb-3 font-semibold">{title}</p>
      <p className="text-gray-500 mb-6">{description}</p>
      <Button 
        className="bg-airsoft-red hover:bg-red-700"
        onClick={onRetry}
      >
        Réessayer
      </Button>
    </div>
  </div>
);

interface EmptyStateProps {
  message: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, description }) => (
  <div className="text-center py-12">
    <p className="text-gray-500 text-lg">{message}</p>
    {description && <p className="text-gray-400 mt-2">{description}</p>}
  </div>
);
