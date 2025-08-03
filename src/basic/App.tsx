import { useState, useCallback, useEffect } from 'react'
import { Notification } from './types'
import { AdminPage } from './components/AdminPage'
import { useProducts } from './hooks/useProducts'
import { CartPage } from './components/CartPage'
import { getRemainingStock } from './models/cart'
import { useCart } from './hooks/useCart'
import { useCoupons } from './hooks/useCoupons'
import { Header } from './components/ui/Header'
import { Notifications } from './components/ui/Notifications'

const App = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const addNotification = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
      const id = Date.now().toString()
      setNotifications((prev) => [...prev, { id, message, type }])

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
      }, 3000)
    },
    [],
  )

  const { products, addProduct, updateProduct, deleteProduct } =
    useProducts(addNotification)
  const {
    cart,
    setCart,
    removeFromCart,
    updateQuantity,
    selectedCoupon,
    setSelectedCoupon,
    addToCart,
    applyCoupon,
    calculateCartTotal,
    calculateItemTotal,
  } = useCart(addNotification)
  const { coupons, addCoupon, deleteCoupon } = useCoupons(
    addNotification,
    selectedCoupon,
    setSelectedCoupon,
  )
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState<'products' | 'coupons'>('products')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [totalItemCount, setTotalItemCount] = useState(0)

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0)
    setTotalItemCount(count)
  }, [cart])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const formatPrice = (price: number, productId?: string): string => {
    if (productId) {
      const product = products.find((p) => p.id === productId)
      if (product && getRemainingStock(product, cart) <= 0) {
        return 'SOLD OUT'
      }
    }

    if (isAdmin) {
      return `${price.toLocaleString()}원`
    }

    return `₩${price.toLocaleString()}`
  }

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      'success',
    )
    setCart([])
    setSelectedCoupon(null)
  }, [addNotification, setCart, setSelectedCoupon])

  const totals = calculateCartTotal()

  const headerState = {
    isAdmin,
    searchTerm,
    cart,
    totalItemCount,
    setSearchTerm,
    setIsAdmin,
  }

  const adminState = {
    activeTab,
    setActiveTab,
    products,
    formatPrice,
    deleteProduct,
    addNotification,
    coupons,
    deleteCoupon,
    updateProduct,
    addProduct,
    addCoupon,
  }

  const cartState = {
    products,
    cart,
    coupons,
    totals,
    debouncedSearchTerm,
    selectedCoupon,
    addToCart,
    removeFromCart,
    formatPrice,
    calculateItemTotal,
    updateQuantity,
    applyCoupon,
    setSelectedCoupon,
    completeOrder,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <Header {...headerState} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? <AdminPage {...adminState} /> : <CartPage {...cartState} />}
      </main>
    </div>
  )
}

export default App
