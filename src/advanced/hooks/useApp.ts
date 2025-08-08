import { atom, useAtom } from "jotai"

const activeTabAtom = atom<"products" | "coupons">("products")

export function useApp() {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom)

  return { activeTab, setActiveTab }
}
