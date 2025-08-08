export const createStore = (key: string, storage: Storage = window.localStorage) => {
  const get = () => {
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(`Error getting storage item for key "${key}":`, error);
      return null;
    }
  };

  const set = (value: any) => {
    try {
      const serialized = JSON.stringify(value);
      storage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error setting storage item for key "${key}":`, error);
    }
  };

  const remove = () => {
    try {
      storage.removeItem(key);
    } catch (error) {
      console.error(`Error removing storage item for key "${key}":`, error);
    }
  };

  return {
    get,
    set,
    remove,
  };
};
