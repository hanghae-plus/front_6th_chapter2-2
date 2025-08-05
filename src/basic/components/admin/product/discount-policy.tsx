import { ProductForm } from "@/types/product.type";
import { Dispatch, SetStateAction } from "react";

type Props = {
  productForm: ProductForm;
  setProductForm: Dispatch<SetStateAction<ProductForm>>;
};

const DiscountPolicy = ({ productForm, setProductForm }: Props) => {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        할인 정책
      </label>
      <div className="space-y-2">
        {productForm.discounts.map((discount, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-gray-50 p-2 rounded"
          >
            <input
              type="number"
              value={discount.quantity}
              onChange={(e) => {
                const newDiscounts = [...productForm.discounts];
                newDiscounts[index].quantity = parseInt(e.target.value) || 0;
                setProductForm({
                  ...productForm,
                  discounts: newDiscounts,
                });
              }}
              className="w-20 px-2 py-1 border rounded"
              min="1"
              placeholder="수량"
            />
            <span className="text-sm">개 이상 구매 시</span>
            <input
              type="number"
              value={discount.rate * 100}
              onChange={(e) => {
                const newDiscounts = [...productForm.discounts];
                newDiscounts[index].rate =
                  (parseInt(e.target.value) || 0) / 100;
                setProductForm({
                  ...productForm,
                  discounts: newDiscounts,
                });
              }}
              className="w-16 px-2 py-1 border rounded"
              min="0"
              max="100"
              placeholder="%"
            />
            <span className="text-sm">% 할인</span>
            <button
              type="button"
              onClick={() => {
                const newDiscounts = productForm.discounts.filter(
                  (_, i) => i !== index
                );
                setProductForm({
                  ...productForm,
                  discounts: newDiscounts,
                });
              }}
              className="text-red-600 hover:text-red-800"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            setProductForm({
              ...productForm,
              discounts: [
                ...productForm.discounts,
                { quantity: 10, rate: 0.1 },
              ],
            });
          }}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          + 할인 추가
        </button>
      </div>
    </div>
  );
};

export default DiscountPolicy;
