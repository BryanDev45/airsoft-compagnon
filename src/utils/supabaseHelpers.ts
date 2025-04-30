
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper function to call Supabase RPC functions with type safety bypassing
 */
export const callRPC = async <T,>(functionName: string, params: Record<string, any> = {}): Promise<{data: T | null, error: Error | null}> => {
  try {
    // @ts-ignore - We're intentionally bypassing TypeScript's type checking here
    const result = await supabase.rpc(functionName, params);
    return result;
  } catch (error) {
    console.error(`Error calling RPC function ${functionName}:`, error);
    return { data: null, error: error as Error };
  }
};
