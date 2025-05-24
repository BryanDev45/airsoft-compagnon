
import React from 'react';
import { Wrench } from 'lucide-react';

const ToolboxHeader = () => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
        <Wrench className="h-8 w-8 text-airsoft-red" />
        ToolBox Airsoft
      </h1>
      <p className="text-gray-600 mb-6">
        Outils et calculateurs pour vous aider dans votre pratique de l'airsoft
      </p>
    </div>
  );
};

export default ToolboxHeader;
