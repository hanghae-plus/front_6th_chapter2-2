import { useState, useCallback } from "react";

export function useTabs() {
  const [activeTab, setActiveTab] = useState<"products" | "coupons">("products");

  const switchToProducts = useCallback(() => {
    setActiveTab("products");
  }, []);

  const switchToCoupons = useCallback(() => {
    setActiveTab("coupons");
  }, []);

  return {
    activeTab,
    setActiveTab,
    switchToProducts,
    switchToCoupons,
  };
}