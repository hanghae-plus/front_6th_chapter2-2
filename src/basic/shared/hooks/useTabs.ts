import { useState, type ReactNode } from "react";

type TabItem<T extends string = string> = {
  id: T;
  label: string;
  content: ReactNode;
};
type TabConfig<T extends string = string> = {
  tabs: TabItem<T>[];
  defaultTab: T;
};

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
