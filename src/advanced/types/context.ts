import { ProductWithUI } from '../../basic/types'
import { CartItem, Coupon } from '../../types'

export interface CartItemContext {
  cart: CartItem[]
  completeOrder: () => void
  removeFromCart: (productId: string) => void
  updateQuantity: (
    productId: string,
    newQuantity: number,
    products: ProductWithUI[],
  ) => void
  getRemainingStock: (product: ProductWithUI) => number
  addToCart: (product: ProductWithUI) => void
  calculateCartTotal: () => {
    totalBeforeDiscount: number
    totalAfterDiscount: number
  }
  calculateTotal: (item: CartItem) => number
  selectedCoupon: Coupon | null
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>
  handleSelectCoupon: (
    e: React.ChangeEvent<HTMLSelectElement>,
    coupons: Coupon[],
  ) => void
  totalItemCount: number
}

export interface ProductContext {
  products: ProductWithUI[]
  addProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void
  deleteProduct: (productId: string) => void
  getFilteredProducts: (searchTerm: string) => ProductWithUI[]
}

export interface CouponContext {
  coupons: Coupon[]
  addCoupon: (newCoupon: Coupon) => void
  deleteCoupon: (couponCode: string) => void
}