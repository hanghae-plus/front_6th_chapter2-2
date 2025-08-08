import { atom, useAtom } from "jotai"

const activeTabAtom = atom<"products" | "coupons">("products")
const isAdminAtom = atom<boolean>(false)
const searchTermAtom = atom<string>("")
const showProductFormAtom = atom<boolean>(false)
const showCouponFormAtom = atom<boolean>(false)

export function useApp() {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom)
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom)
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom)
  const [showProductForm, setShowProductForm] = useAtom(showProductFormAtom)
  const [showCouponForm, setShowCouponForm] = useAtom(showCouponFormAtom)

  return {
    activeTab,
    setActiveTab,
    isAdmin,
    setIsAdmin,
    searchTerm,
    setSearchTerm,
    showProductForm,
    setShowProductForm,
    showCouponForm,
    setShowCouponForm,
  }
}
