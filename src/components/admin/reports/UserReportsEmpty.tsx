
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const UserReportsEmpty: React.FC = () => {
  return (
    <Card>
      <CardContent className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucun rapport d'utilisateur trouvé</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserReportsEmpty;
