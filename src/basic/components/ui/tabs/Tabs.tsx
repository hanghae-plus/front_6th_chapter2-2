import { createContext, useContext, useState, ReactNode } from "react";

// Tabs Context 타입 정의
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

// Tabs Context 생성
const TabsContext = createContext<TabsContextType | undefined>(undefined);

// Tabs Context Hook
const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tab components must be used within a Tabs provider");
  }
  return context;
};

// 메인 Tabs 컴포넌트
interface TabsProps {
  children: ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const Tabs = ({ children, defaultValue = "", value, onValueChange }: TabsProps) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultValue);

  // 제어된 컴포넌트인지 비제어된 컴포넌트인지 확인
  const isControlled = value !== undefined;
  const activeTab = isControlled ? value : internalActiveTab;

  const setActiveTab = (tab: string) => {
    if (!isControlled) {
      setInternalActiveTab(tab);
    }
    onValueChange?.(tab);
  };

  return <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>;
};

// Tab List 컴포넌트 (탭 버튼들의 컨테이너)
interface TabListProps {
  children: ReactNode;
  className?: string;
}

const TabList = ({ children, className = "" }: TabListProps) => {
  return (
    <div className={`border-b border-gray-200 mb-6 ${className}`}>
      <nav className="-mb-px flex space-x-8">{children}</nav>
    </div>
  );
};

// 개별 Tab 버튼 컴포넌트
interface TabTriggerProps {
  children: ReactNode;
  value: string;
  className?: string;
}

const TabTrigger = ({ children, value, className = "" }: TabTriggerProps) => {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
        isActive
          ? "border-gray-900 text-gray-900"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      } ${className}`}
    >
      {children}
    </button>
  );
};

// Tab Content 컨테이너
interface TabContentProps {
  children: ReactNode;
  className?: string;
}

const TabContent = ({ children, className = "" }: TabContentProps) => {
  return <div className={className}>{children}</div>;
};

// 개별 Tab Panel
interface TabPanelProps {
  children: ReactNode;
  value: string;
  className?: string;
}

const TabPanel = ({ children, value, className = "" }: TabPanelProps) => {
  const { activeTab } = useTabs();

  if (activeTab !== value) {
    return null;
  }

  return <div className={className}>{children}</div>;
};

const TabsCompound = Object.assign(Tabs, {
  List: TabList,
  Trigger: TabTrigger,
  Content: TabContent,
  Panel: TabPanel,
});

export { TabsCompound as Tabs };

// 개별 컴포넌트도 export (필요시)
export { TabList, TabTrigger, TabContent, TabPanel };

// Hook도 export
export { useTabs };
