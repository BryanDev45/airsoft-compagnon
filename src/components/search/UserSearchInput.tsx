
import React, { useRef, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UserSearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const UserSearchInput = React.memo(({ searchQuery, onSearchChange }: UserSearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  return (
    <div className="flex items-center border rounded-md overflow-hidden w-full max-w-md mb-6">
      <Input
        ref={inputRef}
        placeholder="Rechercher un joueur par nom..."
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

UserSearchInput.displayName = 'UserSearchInput';

export default UserSearchInput;
