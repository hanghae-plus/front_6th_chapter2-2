export function AdminTab({
  tabs,
  activeTab,
  setActiveTab,
}: {
  tabs: {
    label: string;
    value: "products" | "coupons";
  }[];
  activeTab: "products" | "coupons";
  setActiveTab: React.Dispatch<React.SetStateAction<"products" | "coupons">>;
}) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.value
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
