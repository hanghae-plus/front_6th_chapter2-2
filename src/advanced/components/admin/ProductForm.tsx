import React from "react";
import { CloseIcon } from ".././icons";
import { useValidate } from "../../utils/hooks/useValidate";
import { safeParseInt } from "../../utils/validators";
import { useProducts } from "../../hooks/useProducts";
import { createEmptyProductForm } from "../../models/product";
import { useNotifications } from "../../hooks/useNotifications";

interface ProductFormProps {
  showProductForm: boolean;
  setShowProductForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ProductForm = ({
  showProductForm,
  setShowProductForm,
}: ProductFormProps) => {
  const {
    addProduct,
    updateProduct,
    productForm,
    setProductForm,
    editingProduct,
    addDiscountAction,
    removeDiscountAction,
    updateDiscountQuantityAction,
    updateDiscountRateAction,
    setEditingProduct,
  } = useProducts();
  const { validatePrice, validateStock, filterNumericInput } = useValidate();
  const { onError } = useNotifications();

  if (!showProductForm) {
    return null;
  }

  const filterPriceInputOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputFilter = filterNumericInput(event.target.value);

    if (inputFilter.shouldUpdate) {
      setProductForm({
        ...productForm,
        price: inputFilter.filteredValue,
      });
    }
  };

  const handleSubmitForm = (event: React.FormEvent) => {
    event.preventDefault();

    if (editingProduct === "new") {
      addProduct(productForm);
    }

    if (editingProduct && editingProduct !== "new") {
      updateProduct(editingProduct, productForm);
    }

    setShowProductForm(false);
  };

  const handleCancelForm = () => {
    setEditingProduct(null);
    setProductForm(createEmptyProductForm());
    setShowProductForm(false);
  };

  const filterStockInputOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputFilter = filterNumericInput(event.target.value);

    if (inputFilter.shouldUpdate) {
      setProductForm({
        ...productForm,
        stock: inputFilter.filteredValue,
      });
    }
  };

  const validatePriceOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const priceValidation = validatePrice(event.target.value);

    if (!priceValidation.isValid && priceValidation.error) {
      onError(priceValidation.error);
    }
    setProductForm({ ...productForm, price: priceValidation.price });
  };

  const validateStockOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const stockValidation = validateStock(event.target.value);

    if (!stockValidation.isValid && stockValidation.error) {
      onError(stockValidation.error);
    }
    setProductForm({ ...productForm, stock: stockValidation.stock });
  };

  const updateProductNameOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProductForm({
      ...productForm,
      name: event.target.value,
    });
  };

  const updateProductDescriptionOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProductForm({
      ...productForm,
      description: event.target.value,
    });
  };

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={handleSubmitForm} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {editingProduct === "new" ? "새 상품 추가" : "상품 수정"}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상품명
            </label>
            <input
              type="text"
              value={productForm.name}
              onChange={updateProductNameOnChange}
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
              onChange={updateProductDescriptionOnChange}
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
              onChange={filterPriceInputOnChange}
              onBlur={validatePriceOnBlur}
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
              onChange={filterStockInputOnChange}
              onBlur={validateStockOnBlur}
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
                    updateDiscountQuantityAction({
                      index,
                      quantity: safeParseInt(e.target.value),
                    })
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
                    updateDiscountRateAction({
                      index,
                      rate: safeParseInt(e.target.value) / 100,
                    })
                  }
                  className="w-16 px-2 py-1 border rounded"
                  min="0"
                  max="100"
                  placeholder="%"
                />
                <span className="text-sm">% 할인</span>
                <button
                  type="button"
                  onClick={() => removeDiscountAction(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addDiscountAction()}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + 할인 추가
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancelForm}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            {editingProduct === "new" ? "추가" : "수정"}
          </button>
        </div>
      </form>
    </div>
  );
};
