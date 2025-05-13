
import { useProfileData } from './profile/useProfileData';
import { Profile, UserStats } from '@/types/profile';

// Re-export the hook from the new location for backward compatibility
export { useProfileData };

// Also export types for easier access
export type { Profile, UserStats };
