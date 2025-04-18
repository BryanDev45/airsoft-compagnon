
import { useEffect } from 'react';

// This component will automatically scroll to top on mount
export const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return null;
};
