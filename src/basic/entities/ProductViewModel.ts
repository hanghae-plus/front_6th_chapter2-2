import { Product } from "../../types.ts"

export interface ProductViewModel extends Product {
  description?: string
  isRecommended?: boolean
}
