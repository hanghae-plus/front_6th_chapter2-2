import { Product } from '../../types'

export interface ProductWithUI extends Product {
  description?: string
  isRecommended?: boolean
}

export interface Notification {
  id: string
  message: string
  type: 'error' | 'success' | 'warning'
}
