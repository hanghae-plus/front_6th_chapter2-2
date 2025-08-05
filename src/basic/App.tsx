import { useState, useCallback } from 'react'
import { Notification } from './types'
import { AdminPage } from './components/AdminPage'
import { useProducts } from './hooks/useProducts'
import { CartPage } from './components/CartPage'
import { useCart } from './hooks/useCart'
import { useCoupons } from './hooks/useCoupons'
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

  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getFilteredProducts,
  } = useProducts(addNotification)
  const {
    cart,
    completeOrder,
    removeFromCart,
    updateQuantity,
    selectedCoupon,
    setSelectedCoupon,
    addToCart,
    calculateCartTotal,
    getRemainingStock,
    handleSelectCoupon,
    calculateTotal,
    totalItemCount,
  } = useCart(addNotification)
  const { coupons, addCoupon, deleteCoupon } = useCoupons(
    addNotification,
    selectedCoupon,
    setSelectedCoupon,
  )
  const [isAdmin, setIsAdmin] = useState(false)

  const adminProps = {
    isAdmin,
    setIsAdmin,
    products,
    cart,
    deleteProduct,
    addNotification,
    coupons,
    deleteCoupon,
    updateProduct,
    addProduct,
    addCoupon,
    getRemainingStock,
  }

  const cartProps = {
    isAdmin,
    setIsAdmin,
    products,
    cart,
    coupons,
    totals: calculateCartTotal(),
    selectedCoupon,
    addToCart,
    removeFromCart,
    handleSelectCoupon,
    updateQuantity,
    completeOrder,
    getRemainingStock,
    getFilteredProducts,
    calculateTotal,
    totalItemCount,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications
        notifications={notifications}
        setNotifications={setNotifications}
      />
      {isAdmin ? <AdminPage {...adminProps} /> : <CartPage {...cartProps} />}
    </div>
  )
}

export default App
