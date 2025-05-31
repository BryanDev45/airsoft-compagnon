
import React from 'react';
import { Search } from 'lucide-react';

const SearchHeader: React.FC = () => {
  return (
    <div className="mb-6 flex flex-col items-center text-center">
      <div className="flex items-center gap-3 mb-2">
        <Search className="h-8 w-8 text-airsoft-red" />
        <h1 className="text-4xl font-bold">Recherche</h1>
      </div>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Trouvez des parties, des joueurs, des équipes et des magasins
      </p>
    </div>
  );
};

export default SearchHeader;
