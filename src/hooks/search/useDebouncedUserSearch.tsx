
import { useState, useEffect } from 'react';
import { useOptimizedUserSearch } from './useOptimizedUserSearch';
import { useDebounce } from '../use-debounce';

export const useDebouncedUserSearch = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Debounce the search query to prevent excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Use the existing optimized search hook with debounced query
  const { users, isLoading, refetch } = useOptimizedUserSearch(debouncedSearchQuery);
  
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
    users,
    isLoading,
    refetch
  };
};
