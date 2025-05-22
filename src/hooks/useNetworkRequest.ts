
import { useState, useCallback } from 'react';
import { toast } from "@/components/ui/use-toast";

interface NetworkRequestOptions {
  maxRetries?: number;
  initialDelay?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useNetworkRequest = (options: NetworkRequestOptions = {}) => {
  const { 
    maxRetries = 3, 
    initialDelay = 1000,
    onSuccess,
    onError
  } = options;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);

  const executeRequest = useCallback(async (
    requestFn: () => Promise<any>,
    customOptions: {
      successMessage?: string,
      errorMessage?: string,
      silent?: boolean
    } = {}
  ) => {
    const { successMessage, errorMessage, silent = false } = customOptions;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await requestFn();
      setData(result);
      setRetryCount(0);
      
      if (successMessage && !silent) {
        toast({
          title: "Succès",
          description: successMessage
        });
      }
      
      if (onSuccess) onSuccess(result);
      
      setLoading(false);
      return result;
    } catch (err: any) {
      console.error("Network request error:", err);
      
      // Check if it's a network error and we should retry
      if ((err.message?.includes("Failed to fetch") || 
           err.message?.includes("NetworkError") ||
           err.message?.includes("upstream connect error") ||
           err.message?.includes("network") ||
           err.message?.includes("connection")) && 
          retryCount < maxRetries) {
        
        const nextRetryCount = retryCount + 1;
        setRetryCount(nextRetryCount);
        
        // Exponential backoff
        const delay = initialDelay * Math.pow(2, retryCount);
        
        if (!silent) {
          toast({
            title: "Problème de connexion",
            description: `Nouvelle tentative dans ${delay/1000} secondes...`,
          });
        }
        
        // Schedule retry
        setTimeout(() => {
          executeRequest(requestFn, customOptions);
        }, delay);
      } else {
        // Max retries reached or not a network error
        setError(err);
        
        if (errorMessage && !silent) {
          toast({
            title: "Erreur",
            description: errorMessage,
            variant: "destructive",
          });
        }
        
        if (onError) onError(err);
      }
      
      setLoading(false);
      throw err;
    }
  }, [retryCount, maxRetries, initialDelay, onSuccess, onError]);

  return {
    loading,
    error,
    data,
    retryCount,
    executeRequest,
    setData
  };
};
