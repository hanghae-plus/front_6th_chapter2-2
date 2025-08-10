import { useState, useCallback } from "react";

export const useTab = <T extends string>(initialTab: T) => {
  const [activeTab, setActiveTab] = useState<T>(initialTab);

  const changeTab = useCallback((tab: T) => {
    setActiveTab(tab);
  }, []);

  return {
    activeTab,
    setActiveTab: changeTab,
  };
};
