import { useState, useCallback } from 'react'
import { Notification } from './types'
import { AdminPage } from './components/AdminPage'
import { ProductsContext, useProducts } from './hooks/useProducts'
import { CartPage } from './components/CartPage'
import { CartContext, useCart } from './hooks/useCart'
import { CouponsContext, useCoupons } from './hooks/useCoupons'
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Notifications
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <CartContext.Provider
        value={{
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
        }}
      >
        <ProductsContext.Provider
          value={{
            products,
            addProduct,
            updateProduct,
            deleteProduct,
            getFilteredProducts,
          }}
        >
          <CouponsContext.Provider value={{ coupons, addCoupon, deleteCoupon }}>
            {isAdmin ? (
              <AdminPage
                {...{
                  isAdmin,
                  setIsAdmin,
                  addNotification,
                }}
              />
            ) : (
              <CartPage
                {...{
                  isAdmin,
                  setIsAdmin,
                }}
              />
            )}
          </CouponsContext.Provider>
        </ProductsContext.Provider>
      </CartContext.Provider>
    </div>
  )
}

export default App
