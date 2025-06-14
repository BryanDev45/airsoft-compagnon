
import { getStorageWithExpiry } from '@/utils/cacheUtils';

// Cache keys
const USER_CACHE_KEY = 'auth_user';
const SESSION_CACHE_KEY = 'auth_session';
const AUTH_STATE_KEY = 'auth_state';
const REMEMBER_ME_KEY = 'auth_remember_me';

// Helper function to get data from either localStorage or sessionStorage
export const getFromStorage = (key: string) => {
  // First try localStorage
  const fromLocalStorage = getStorageWithExpiry(key);
  if (fromLocalStorage) {
    return fromLocalStorage;
  }
  
  // Then try sessionStorage
  try {
    const item = sessionStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      if (parsed.expiry && Date.now() < parsed.expiry) {
        return parsed.data;
      } else {
        sessionStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('Error reading from sessionStorage:', error);
  }
  
  return null;
};

export const checkSessionValidity = () => {
  const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  const cachedAuthState = getFromStorage(AUTH_STATE_KEY);
  
  if (!rememberMe && !cachedAuthState) {
    localStorage.removeItem(USER_CACHE_KEY);
    localStorage.removeItem(SESSION_CACHE_KEY);
    localStorage.removeItem(AUTH_STATE_KEY);
  }
  return true;
};

export const getCachedAuthData = () => {
  const cachedUser = getFromStorage(USER_CACHE_KEY);
  const cachedSession = getFromStorage(SESSION_CACHE_KEY);
  const cachedAuthState = getFromStorage(AUTH_STATE_KEY);
  
  return { cachedUser, cachedSession, cachedAuthState };
};

export { USER_CACHE_KEY, SESSION_CACHE_KEY, AUTH_STATE_KEY, REMEMBER_ME_KEY };
