import { useState, FocusEvent, createContext } from 'react'
import { ProductWithUI } from '../types'
import { Coupon, Discount, ProductForm } from '../../types'
import { isValidStrNumber } from '../utils/validators'
import {
  MAX_DISCOUNT_AMOUNT,
  MAX_DISCOUNT_RATE,
  MAX_STOCK_LIMIT,
} from '../constants'
import { CouponFormContext, ProductFormContext } from '../types/context'

export const CouponItemFormContext = createContext<
  CouponFormContext | undefined
>(undefined)

export function useCouponForm(
  addCoupon: (newCoupon: Coupon) => void,
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning',
  ) => void,
) {
  const [showCouponForm, setShowCouponForm] = useState(false)
  const toggleShowCouponForm = (isShow?: boolean) => {
    if (isShow !== undefined) {
      setShowCouponForm(isShow)
    }
    setShowCouponForm((prev) => !prev)
  }

  const [couponForm, setCouponForm] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'amount' as 'amount' | 'percentage',
    discountValue: 0,
  })

  const handleEditCouponForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: string,
  ) => {
    const { value } = e.target
    if (key === 'discountValue') {
      if (value === '' || isValidStrNumber(value)) {
        setCouponForm((prev) => ({
          ...prev,
          [key]: value === '' ? 0 : parseInt(value),
        }))
      }
    } else {
      setCouponForm((prev) => ({
        ...prev,
        [key]: key === 'code' ? value.toUpperCase() : value,
      }))
    }
  }

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addCoupon(couponForm)
    setCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0,
    })
    setShowCouponForm(false)
  }

  const handleDiscountValueValidation = (e: FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0

    if (couponForm.discountType === 'percentage') {
      if (value > MAX_DISCOUNT_RATE) {
        addNotification('할인율은 100%를 초과할 수 없습니다', 'error')
        setCouponForm({
          ...couponForm,
          discountValue: MAX_DISCOUNT_RATE,
        })
      } else if (value < 0) {
        setCouponForm({
          ...couponForm,
          discountValue: 0,
        })
      }
    } else {
      if (value > MAX_DISCOUNT_AMOUNT) {
        addNotification('할인 금액은 100,000원을 초과할 수 없습니다', 'error')
        setCouponForm({
          ...couponForm,
          discountValue: MAX_DISCOUNT_AMOUNT,
        })
      } else if (value < 0) {
        setCouponForm({
          ...couponForm,
          discountValue: 0,
        })
      }
    }
  }

  return {
    couponForm,
    setCouponForm,
    showCouponForm,
    toggleShowCouponForm,
    handleCouponSubmit,
    handleEditCouponForm,
    handleDiscountValueValidation,
  }
}

export const ProductItemFormContext = createContext<
  ProductFormContext | undefined
>(undefined)

export function useProductForm(
  addProduct: (newProduct: Omit<ProductWithUI, 'id'>) => void,
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void,
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning',
  ) => void,
) {
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [productForm, setProductForm] = useState<ProductForm>({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    discounts: [],
  })

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id)
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || '',
      discounts: product.discounts || [],
    })
    setShowProductForm(true)
  }

  const handleAddOrCloseProductForm = (
    type: string | null,
    isShowProductForm: boolean,
  ) => {
    setEditingProduct(type)
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    })
    setShowProductForm(isShowProductForm)
  }

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm)
      setEditingProduct(null)
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      })
    }
    setProductForm({
      name: '',
      price: 0,
      stock: 0,
      description: '',
      discounts: [],
    })
    setEditingProduct(null)
    setShowProductForm(false)
  }

  const handleEditProuctForm = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string,
    index?: number,
  ) => {
    const { value } = e.target

    if (['name', 'description'].includes(key)) {
      setProductForm((prev) => ({
        ...prev,
        [key]: value,
      }))
    }

    if (
      ['price', 'stock'].includes(key) &&
      (value === '' || isValidStrNumber(value))
    ) {
      setProductForm({
        ...productForm,
        [key]: value === '' ? 0 : parseInt(value),
      })
    }

    if (index && ['quantity', 'rate'].includes(key)) {
      const newDiscounts = [...productForm.discounts]
      const value = parseInt(e.target.value) || 0
      newDiscounts[index][key as keyof Discount] =
        value / (key === 'rate' ? MAX_DISCOUNT_RATE : 1)
      setProductForm({
        ...productForm,
        discounts: newDiscounts,
      })
    }
  }

  const handleDeleteDiscount = (index: number) => {
    const newDiscounts = productForm.discounts.filter((_, i) => i !== index)
    setProductForm({
      ...productForm,
      discounts: newDiscounts,
    })
  }

  const handleAddDiscount = () => {
    setProductForm({
      ...productForm,
      discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }],
    })
  }

  const handlePriceValidation = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      setProductForm({ ...productForm, price: 0 })
    } else if (parseInt(value) < 0) {
      addNotification('가격은 0보다 커야 합니다', 'error')
      setProductForm({ ...productForm, price: 0 })
    }
  }

  const handleStockValidation = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      setProductForm({ ...productForm, stock: 0 })
    } else if (parseInt(value) < 0) {
      addNotification('재고는 0보다 커야 합니다', 'error')
      setProductForm({ ...productForm, stock: 0 })
    } else if (parseInt(value) > MAX_STOCK_LIMIT) {
      addNotification('재고는 9999개를 초과할 수 없습니다', 'error')
      setProductForm({ ...productForm, stock: MAX_STOCK_LIMIT })
    }
  }

  return {
    productForm,
    editingProduct,
    showProductForm,
    setEditingProduct,
    setProductForm,
    setShowProductForm,
    startEditProduct,
    handleProductSubmit,
    handleAddOrCloseProductForm,
    handleDeleteDiscount,
    handleAddDiscount,
    handleEditProuctForm,
    handlePriceValidation,
    handleStockValidation,
  }
}
