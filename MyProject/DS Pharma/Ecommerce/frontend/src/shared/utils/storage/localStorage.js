// Local Storage Service
// ============================================================
// Wrapper for localStorage operations with error handling

const STORAGE_PREFIX = 'dspharma_';

export const storageService = {
  // Set item with prefix
  setItem: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, serializedValue);
    } catch (error) {
      console.error(`Failed to set ${key} in localStorage:`, error);
    }
  },

  // Get item with prefix
  getItem: (key) => {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Failed to get ${key} from localStorage:`, error);
      return null;
    }
  },

  // Remove item with prefix
  removeItem: (key) => {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (error) {
      console.error(`Failed to remove ${key} from localStorage:`, error);
    }
  },

  // Clear all items with prefix
  clear: () => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },

  // Get all items with prefix
  getAllItems: () => {
    try {
      const items = {};
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          const cleanKey = key.replace(STORAGE_PREFIX, '');
          items[cleanKey] = JSON.parse(localStorage.getItem(key));
        }
      });
      return items;
    } catch (error) {
      console.error('Failed to get all items from localStorage:', error);
      return {};
    }
  },
};

export default storageService;
