import { IconDelete } from "../../../components/icons/IconDelete"

export function AdminProductsDiscount({
  index,
  discount,
  productForm,
  setProductForm,
}: {
  index: number
  discount: { quantity: number; rate: number }
  productForm: { name: string; price: number; stock: number; description: string; discounts: Array<{ quantity: number; rate: number }> }
  setProductForm: (form: {
    name: string
    price: number
    stock: number
    description: string
    discounts: Array<{ quantity: number; rate: number }>
  }) => void
}) {
  function handleDiscountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newDiscounts = [...productForm.discounts]
    newDiscounts[index].quantity = parseInt(e.target.value) || 0
    setProductForm({ ...productForm, discounts: newDiscounts })
  }

  function handleDiscountRateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newDiscounts = [...productForm.discounts]
    newDiscounts[index].rate = (parseInt(e.target.value) || 0) / 100
    setProductForm({ ...productForm, discounts: newDiscounts })
  }

  function handleDiscountDelete() {
    const newDiscounts = productForm.discounts.filter((_, i) => i !== index)
    setProductForm({ ...productForm, discounts: newDiscounts })
  }

  return (
    <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
      <input
        type="number"
        className="w-20 px-2 py-1 border rounded"
        value={discount.quantity}
        onChange={handleDiscountChange}
        min="1"
        placeholder="수량"
      />
      <span className="text-sm">개 이상 구매 시</span>
      <input
        type="number"
        className="w-16 px-2 py-1 border rounded"
        value={discount.rate * 100}
        onChange={handleDiscountRateChange}
        min="0"
        max="100"
        placeholder="%"
      />
      <span className="text-sm">% 할인</span>
      <button type="button" className="text-red-600 hover:text-red-800" onClick={handleDiscountDelete}>
        <IconDelete />
      </button>
    </div>
  )
}
