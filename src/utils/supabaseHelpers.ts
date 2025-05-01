
import { supabase } from '@/integrations/supabase/client';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

/**
 * Helper function to call Supabase RPC functions with type safety
 */
export const callRPC = async <T>(
  functionName: string, 
  params: Record<string, any> = {}
): Promise<{data: T | null, error: Error | null}> => {
  try {
    // Cast the function name to any to bypass TypeScript's limited function name type checking
    const result = await supabase.rpc(functionName as any, params);
    
    return { 
      data: result.data as T, 
      error: result.error as Error 
    };
  } catch (error) {
    console.error(`Error calling RPC function ${functionName}:`, error);
    return { data: null, error: error as Error };
  }
};
