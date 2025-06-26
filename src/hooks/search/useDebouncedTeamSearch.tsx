
import { useState, useEffect } from 'react';
import { useTeamSearch } from '../../components/search/hooks/useTeamSearch';
import { useDebounce } from '../use-debounce';

export const useDebouncedTeamSearch = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Debounce the search query to prevent excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Use the existing team search hook with debounced query
  const { data: teams = [], isLoading, refetch } = useTeamSearch(debouncedSearchQuery);
  
  // Update search query when input changes, but with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [inputValue]);
  
  return {
    inputValue,
    setInputValue,
    teams,
    isLoading,
    refetch
  };
};
