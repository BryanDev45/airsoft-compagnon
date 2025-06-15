
import { useUserPresence } from '@/hooks/messaging/useUserPresence';
import { useRealtimeMessages } from '@/hooks/messaging/useRealtimeMessages';

const GlobalServices = () => {
  // These hooks initialize global listeners and should only be called once.
  useUserPresence();
  useRealtimeMessages();

  return null;
};

export default GlobalServices;
