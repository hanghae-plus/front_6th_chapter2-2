import { useState } from "react";

type Accessor<T> = keyof T | ((item: T) => string);

type TabWithActive<T> = {
  data: T;
  active: boolean;
  activate: () => void;
};

interface Props<T> {
  tabs: T[];
  initialTabId: string;
  accessor: Accessor<T>;
  options?: {
    onChange?: (tab: T) => void;
  };
}

export const useTab = <T>({
  initialTabId,
  tabs,
  accessor,
  options,
}: Props<T>) => {
  const getTabId = (tab: T): string => {
    if (typeof accessor === "function") {
      return accessor(tab);
    }
    const value = tab[accessor];
    return typeof value === "string" ? value : String(value);
  };

  const findTabById = (tabId: string): T | undefined => {
    return tabs.find((tab) => getTabId(tab) === tabId);
  };

  const initialTab = findTabById(initialTabId);
  if (!initialTab) {
    throw new Error(`Initial tab with id "${initialTabId}" not found`);
  }

  const [activeTabId, setActiveTabId] = useState<string>(initialTabId);

  const handleTabClick = (tabId: string) => {
    const targetTab = findTabById(tabId);
    if (targetTab) {
      setActiveTabId(tabId);
      options?.onChange?.(targetTab);
    }
  };

  const getTabs = (): TabWithActive<T>[] => {
    return tabs.map((tab) => {
      const tabId = getTabId(tab);
      return {
        data: tab,
        active: tabId === activeTabId,
        activate: () => handleTabClick(tabId),
      };
    });
  };

  const getActiveTab = (): T | undefined => {
    return findTabById(activeTabId);
  };

  return {
    getTabs,
    getActiveTab,
  };
};
