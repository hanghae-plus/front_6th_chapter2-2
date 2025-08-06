import { ProductWithUI } from "../../../entities/products/product.types";
import { CloseIcon } from "../../icons";
import { PRICE, MESSAGES } from "../../../constants";

interface ProductFormProps {
  productForm: {
    name: string;
    price: number;
    stock: number;
    description: string;
    discounts: Array<{ quantity: number; rate: number }>;
  };
  editingProduct: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onUpdateField: (field: string, value: any) => void;
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const ProductForm = ({
  productForm,
  editingProduct,
  onSubmit,
  onCancel,
  onUpdateField,
  addNotification,
}: ProductFormProps) => {
  const handleFieldChange = (field: string, value: any) => {
    onUpdateField(field, value);
  };

  const handlePriceChange = (value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      handleFieldChange("price", value === "" ? 0 : parseInt(value));
    }
  };

  const handlePriceBlur = (value: string) => {
    if (value === "") {
      handleFieldChange("price", 0);
    } else if (parseInt(value) < 0) {
      addNotification(MESSAGES.ERROR.PRICE_INVALID, "error");
      handleFieldChange("price", 0);
    }
  };

  const handleStockChange = (value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      handleFieldChange("stock", value === "" ? 0 : parseInt(value));
    }
  };

  const handleStockBlur = (value: string) => {
    const numValue = parseInt(value) || 0;

    if (value === "") {
      handleFieldChange("stock", 0);
    } else if (numValue < 0) {
      addNotification(MESSAGES.ERROR.STOCK_INVALID, "error");
      handleFieldChange("stock", 0);
    } else if (numValue > PRICE.MAX_STOCK) {
      addNotification(
        MESSAGES.ERROR.STOCK_MAX_EXCEEDED(PRICE.MAX_STOCK),
        "error"
      );
      handleFieldChange("stock", PRICE.MAX_STOCK);
    }
  };

  const handleDiscountChange = (
    index: number,
    field: "quantity" | "rate",
    value: number
  ) => {
    const newDiscounts = [...productForm.discounts];
    newDiscounts[index][field] = value;
    onUpdateField("discounts", newDiscounts);
  };

  const handleAddDiscount = () => {
    const newDiscounts = [
      ...productForm.discounts,
      { quantity: 10, rate: 0.1 },
    ];
    onUpdateField("discounts", newDiscounts);
  };

  const handleRemoveDiscount = (index: number) => {
    const newDiscounts = productForm.discounts.filter((_, i) => i !== index);
    onUpdateField("discounts", newDiscounts);
  };

  const isNewProduct = editingProduct === "new";

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={onSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {isNewProduct ? "새 상품 추가" : "상품 수정"}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상품명
            </label>
            <input
              type="text"
              value={productForm.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <input
              type="text"
              value={productForm.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              가격
            </label>
            <input
              type="text"
              value={productForm.price === 0 ? "" : productForm.price}
              onChange={(e) => handlePriceChange(e.target.value)}
              onBlur={(e) => handlePriceBlur(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              재고
            </label>
            <input
              type="text"
              value={productForm.stock === 0 ? "" : productForm.stock}
              onChange={(e) => handleStockChange(e.target.value)}
              onBlur={(e) => handleStockBlur(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </div>
        </div>
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
                  onChange={(e) =>
                    handleDiscountChange(
                      index,
                      "quantity",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-20 px-2 py-1 border rounded"
                  min="1"
                  placeholder="수량"
                />
                <span className="text-sm">개 이상 구매 시</span>
                <input
                  type="number"
                  value={discount.rate * 100}
                  onChange={(e) =>
                    handleDiscountChange(
                      index,
                      "rate",
                      (parseInt(e.target.value) || 0) / 100
                    )
                  }
                  className="w-16 px-2 py-1 border rounded"
                  min="0"
                  max="100"
                  placeholder="%"
                />
                <span className="text-sm">% 할인</span>
                <button
                  type="button"
                  onClick={() => handleRemoveDiscount(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <CloseIcon />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddDiscount}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + 할인 추가
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            {isNewProduct ? "추가" : "수정"}
          </button>
        </div>
      </form>
    </div>
  );
};
