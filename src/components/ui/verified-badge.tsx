
import React from 'react';

interface VerifiedBadgeProps {
  size?: number;
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ 
  size = 20, 
  className = "" 
}) => {
  return (
    <img 
      src="/lovable-uploads/3c025802-3046-4c34-ae5e-2328e941b479.png" 
      alt="Compte vérifié" 
      className={`inline-block ${className}`}
      style={{ width: size, height: size }}
    />
  );
};
