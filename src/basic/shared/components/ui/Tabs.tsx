import { PropsWithChildren, createContext, useContext, useState } from "react";

interface TabsContextType<T> {
  activeTab: T | null;
  setActiveTab: (tab: T) => void;
}

const TabsContext = createContext<TabsContextType<any> | null>(null);

interface TabsContextType<T> {
  activeTab: T | null;
  setActiveTab: (tab: T) => void;
}

const useTabsContext = () => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("useTabsContext must be used within a TabsProvider");
  }

  return context;
};

interface TabsProviderProps<T> extends PropsWithChildren {
  initialValue: T;
}

function Tabs<T>({ children, initialValue }: TabsProviderProps<T>) {
  const [activeTab, setActiveTab] = useState<T>(initialValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

const TabsList = ({ children }: PropsWithChildren) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">{children}</nav>
    </div>
  );
};

interface TabsTriggerProps<T> extends PropsWithChildren {
  value: T;
}

const TabsTrigger = <T,>({ children, value }: TabsTriggerProps<T>) => {
  const { activeTab, setActiveTab } = useTabsContext();

  const handleClickTab = () => {
    setActiveTab(value);
  };

  const isActive = activeTab === value;

  return (
    <button
      onClick={handleClickTab}
      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
        isActive
          ? "border-gray-900 text-gray-900"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      {children}
    </button>
  );
};

interface TabsContentProps<T> extends PropsWithChildren {
  value: T;
}

const TabsContent = <T,>({ children, value }: TabsContentProps<T>) => {
  const { activeTab } = useTabsContext();

  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      {children}
    </section>
  );
};

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export default Tabs;
