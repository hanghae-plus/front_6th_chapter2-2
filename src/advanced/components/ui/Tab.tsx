interface Tab<T extends string> {
  id: T;
  name: string;
}

interface Props<T extends string> {
  activeTab: T;
  tabs: Tab<T>[];
  onClickTab: (params: Tab<T>) => void;
}

export function Tab<T extends string>({
  activeTab,
  tabs,
  onClickTab,
}: Props<T>) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => {
          const { id, name } = tab;
          const isActive = activeTab === id;

          return (
            <button
              key={id}
              onClick={() => onClickTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                isActive
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {name}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
