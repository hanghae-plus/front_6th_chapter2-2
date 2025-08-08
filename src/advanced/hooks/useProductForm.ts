import { atom, useAtom } from "jotai"
import type { ProductViewModel } from "../entities/ProductViewModel"

const productFormAtom = atom<ProductViewModel>({
  id: "",
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
  isRecommended: false,
})

const editingProductAtom = atom<"new" | "edit" | null>(null)

export function useProductForm() {
  const [productForm, setProductForm] = useAtom(productFormAtom)
  const [editingProduct, setEditingProduct] = useAtom(editingProductAtom)

  return { productForm, setProductForm, editingProduct, setEditingProduct }
}
