import { createObserver } from './create-observer';

interface StorageInstance<T> {
  get(): T | null;
  set(value: T): void;
  reset(): void;
  subscribe(listener: () => void): () => void;
}

interface StorageEventDetail {
  key: string;
  oldValue: string | null;
  newValue: string | null;
}

class StorageInnerDocumentEvent extends CustomEvent<StorageEventDetail> {
  static readonly eventName = 'storage-inner-document';

  constructor(key: string, oldValue: string | null, newValue: string | null) {
    super(StorageInnerDocumentEvent.eventName, {
      detail: { key, oldValue, newValue },
    });
  }
}

const globalObservers = new Map<string, ReturnType<typeof createObserver>>();

const cacheEviction = new Map<string, () => void>();

const handleStorageEvent = (event: Event) => {
  let targetKey: string | null = null;

  if (event instanceof StorageEvent) {
    targetKey = event.key;
  } else if (event.type === 'storage-inner-document') {
    targetKey = (event as CustomEvent<StorageEventDetail>).detail.key;
  }

  if (targetKey && globalObservers.has(targetKey)) {
    if (cacheEviction.has(targetKey)) {
      cacheEviction.get(targetKey)!();
    }

    globalObservers.get(targetKey)!.notify();
  }
};

let globalListenersRegistered = false;

const getGlobalObserver = (key: string) => {
  if (!globalObservers.has(key)) {
    globalObservers.set(key, createObserver());

    if (!globalListenersRegistered) {
      window.addEventListener('storage', handleStorageEvent);
      window.addEventListener(
        StorageInnerDocumentEvent.eventName,
        handleStorageEvent
      );
      globalListenersRegistered = true;
    }
  }

  return globalObservers.get(key)!;
};

const storageInstances = new Map<string, StorageInstance<unknown>>();

export const createStorage = <T>(
  { key, value }: { key: string; value?: T },
  storage = window.localStorage
): StorageInstance<T> => {
  if (storageInstances.has(key)) {
    return storageInstances.get(key) as StorageInstance<T>;
  } else {
    if (value) {
      storage.setItem(key, JSON.stringify(value));
    }
  }

  const globalObserver = getGlobalObserver(key);

  let cachedValue: T | null = null;
  let isInitialized = false;

  const evictedCache = () => {
    isInitialized = false;
  };

  cacheEviction.set(key, evictedCache);

  const get = (): T | null => {
    if (!isInitialized) {
      try {
        const item = storage.getItem(key);
        cachedValue = item ? JSON.parse(item) : null;
        isInitialized = true;
      } catch (error) {
        console.error(`Error parsing storage item for key "${key}":`, error);
        cachedValue = null;
        isInitialized = true;
      }
    }
    return cachedValue;
  };

  const set = (value: T) => {
    try {
      const oldValue = storage.getItem(key);
      const newValue = JSON.stringify(value);

      storage.setItem(key, newValue);

      cachedValue = value;

      window.dispatchEvent(
        new StorageInnerDocumentEvent(key, oldValue, newValue)
      );
    } catch (error) {
      console.error(`Error setting storage item for key "${key}":`, error);
    }
  };

  const reset = () => {
    try {
      const oldValue = storage.getItem(key);
      storage.removeItem(key);

      cachedValue = null;

      window.dispatchEvent(new StorageInnerDocumentEvent(key, oldValue, null));
    } catch (error) {
      console.error(`Error removing storage item for key "${key}":`, error);
    }
  };

  const subscribe = globalObserver.subscribe;

  const instance = { get, set, reset, subscribe };

  storageInstances.set(key, instance);

  return instance;
};
