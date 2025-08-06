import { useNotifications } from "../../../hooks/useNotifications";
import { useProductForm } from "../../../entities/products/useProductForm";
import { useProductHandlers } from "../../../entities/products/useProductHandlers";
import { useAdminHandlers } from "../../../hooks/useAdminHandlers";
import { useCouponHandlers } from "../../../entities/coupon/useCouponHandlers";
import { CloseIcon } from "../../icons";
import { PRICE, MESSAGES } from "../../../constants";

export const ProductForm = () => {
  // Hook들을 직접 사용
  const { addNotification } = useNotifications();
  const productHandlers = useProductHandlers({ addNotification });
  const couponHandlers = useCouponHandlers({ addNotification });
  const productFormHook = useProductForm();

  const adminHandlers = useAdminHandlers({
    addNotification,
    productActions: productHandlers.actions,
    couponActions: couponHandlers.actions,
    productForm: productFormHook.productForm,
    editingProduct: productFormHook.editingProduct,
    setEditingProduct: productFormHook.setEditingProduct,
    setShowProductForm: productFormHook.setShowProductForm,
    couponForm: {
      name: "",
      code: "",
      discountType: "amount" as const,
      discountValue: 0,
    },
    closeCouponForm: () => {},
  });

  const isNewProduct = productFormHook.editingProduct === "new";

  const handleFieldChange = (field: string, value: any) => {
    productFormHook.updateField(field, value);
  };

  const handlePriceChange = (value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      handleFieldChange("price", value === "" ? 0 : parseInt(value));
    }
  };

  const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      addNotification(MESSAGES.ERROR.PRICE_INVALID, "error");
      return;
    }
    handlePriceChange(value);
  };

  const handleStockChange = (value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      handleFieldChange("stock", value === "" ? 0 : parseInt(value));
    }
  };

  const handleStockInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      addNotification(MESSAGES.ERROR.STOCK_INVALID, "error");
      return;
    }
    if (parseInt(value) > PRICE.MAX_STOCK) {
      addNotification(
        `재고는 최대 ${PRICE.MAX_STOCK}개까지 입력 가능합니다.`,
        "warning"
      );
      return;
    }
    handleStockChange(value);
  };

  const handleDiscountChange = (
    index: number,
    field: "quantity" | "rate",
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    const newDiscounts = [...productFormHook.productForm.discounts];
    newDiscounts[index] = {
      ...newDiscounts[index],
      [field]: field === "rate" ? numValue / 100 : numValue,
    };
    handleFieldChange("discounts", newDiscounts);
  };

  const addDiscount = () => {
    handleFieldChange("discounts", [
      ...productFormHook.productForm.discounts,
      { quantity: 0, rate: 0 },
    ]);
  };

  const removeDiscount = (index: number) => {
    const newDiscounts = productFormHook.productForm.discounts.filter(
      (_, i) => i !== index
    );
    handleFieldChange("discounts", newDiscounts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    adminHandlers.actions.handleProductSubmit(e);
  };

  const handleCancel = () => {
    productFormHook.setShowProductForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {isNewProduct ? "새 상품 추가" : "상품 수정"}
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상품명
            </label>
            <input
              type="text"
              value={productFormHook.productForm.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              가격
            </label>
            <input
              type="text"
              value={productFormHook.productForm.price || ""}
              onChange={handlePriceInput}
              placeholder="숫자만 입력"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              재고
            </label>
            <input
              type="text"
              value={productFormHook.productForm.stock || ""}
              onChange={handleStockInput}
              placeholder="숫자만 입력"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <input
              type="text"
              value={productFormHook.productForm.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                할인 정보
              </label>
              <button
                type="button"
                onClick={addDiscount}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + 할인 추가
              </button>
            </div>
            {productFormHook.productForm.discounts.map((discount, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="number"
                  placeholder="수량"
                  value={discount.quantity || ""}
                  onChange={(e) =>
                    handleDiscountChange(index, "quantity", e.target.value)
                  }
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  min="1"
                />
                <span className="text-sm">개 이상</span>
                <input
                  type="number"
                  placeholder="할인율"
                  value={Math.round((discount.rate || 0) * 100)}
                  onChange={(e) =>
                    handleDiscountChange(index, "rate", e.target.value)
                  }
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  min="0"
                  max="50"
                />
                <span className="text-sm">% 할인</span>
                <button
                  type="button"
                  onClick={() => removeDiscount(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isNewProduct ? "추가" : "수정"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
