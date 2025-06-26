
import { useState, useEffect, useMemo } from 'react';
import { useTeamSearch } from '../../components/search/hooks/useTeamSearch';
import { useDebounce } from '../use-debounce';

export const useDebouncedTeamSearch = () => {
  const [inputValue, setInputValue] = useState('');
  
  // Debounce the input value directly
  const debouncedSearchQuery = useDebounce(inputValue, 300);
  
  // Use the existing team search hook with debounced query
  const { data: teams = [], isLoading, refetch } = useTeamSearch(debouncedSearchQuery);
  
  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    inputValue,
    setInputValue,
    teams,
    isLoading,
    refetch
  }), [inputValue, teams, isLoading, refetch]);
};
