
import React, { useRef, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TeamSearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const TeamSearchInput = React.memo(({ searchQuery, onSearchChange }: TeamSearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  return (
    <div className="flex items-center border rounded-md overflow-hidden w-full max-w-md">
      <Input
        ref={inputRef}
        placeholder="Rechercher une équipe par nom, région..."
        className="border-0 focus-visible:ring-0 flex-1"
        value={searchQuery}
        onChange={handleInputChange}
      />
      <Button variant="ghost" className="rounded-l-none">
        <Search className="h-5 w-5" />
      </Button>
    </div>
  );
});

TeamSearchInput.displayName = 'TeamSearchInput';

export default TeamSearchInput;
