import { useState } from "react";
import type { TabConfig } from "../types/tabs";

export function useTabs<T extends string>(config: TabConfig<T>) {
  const [activeTab, setActiveTab] = useState<T>(config.defaultTab);

  const currentTab = config.tabs.find((tab) => tab.id === activeTab);

  return {
    activeTab,
    setActiveTab,
    currentTab,
    tabs: config.tabs,
  };
}
