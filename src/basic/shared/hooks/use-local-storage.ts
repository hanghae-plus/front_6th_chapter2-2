import type { createStorage } from '@/basic/utils/create-store';
import { useSyncExternalStore } from 'react';

type Storage<T> = ReturnType<typeof createStorage<T>>;

export const useLocalStorage = <T>(storage: Storage<T>) => {
  return useSyncExternalStore(storage.subscribe, storage.get);
};
