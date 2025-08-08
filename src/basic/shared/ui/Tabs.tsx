import { Button } from "./Button";

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  content: React.ReactNode;
}

interface TabsProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
  className?: string;
}

export function Tabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: TabsProps<T>) {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="link"
            onClick={() => onTabChange(tab.id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </nav>
    </div>
  );
}
