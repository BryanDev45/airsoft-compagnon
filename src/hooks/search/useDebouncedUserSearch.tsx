
import { useState, useEffect, useMemo } from 'react';
import { useOptimizedUserSearch } from './useOptimizedUserSearch';
import { useDebounce } from '../use-debounce';

export const useDebouncedUserSearch = () => {
  const [inputValue, setInputValue] = useState('');
  
  // Debounce the input value directly
  const debouncedSearchQuery = useDebounce(inputValue, 300);
  
  // Use the existing optimized search hook with debounced query
  const { users, isLoading, refetch } = useOptimizedUserSearch(debouncedSearchQuery);
  
  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    inputValue,
    setInputValue,
    users,
    isLoading,
    refetch
  }), [inputValue, users, isLoading, refetch]);
};
