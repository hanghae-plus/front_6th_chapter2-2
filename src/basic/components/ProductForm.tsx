import { useCallback } from "react";
import { IProductForm, IProductWithUI } from "../type";
import { MESSAGES } from "../constants/messages";
import { CloseIcon } from "./icon";
import { validator } from "../utils/vaildators";

interface ProductFormProps {
  // product
  setShowProductForm: React.Dispatch<React.SetStateAction<boolean>>;
  addProduct: (newProduct: Omit<IProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<IProductWithUI>) => void;
  editingProduct: string | null;
  setEditingProduct: React.Dispatch<React.SetStateAction<string | null>>;
  productForm: IProductForm;
  setProductForm: React.Dispatch<React.SetStateAction<IProductForm>>;

  // notification
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

const ProductForm = ({
  setShowProductForm,
  addProduct,
  updateProduct,
  editingProduct,
  setEditingProduct,
  productForm,
  setProductForm,
  addNotification,
}: ProductFormProps) => {
  // 상품 추가
  const addProductItem = useCallback(
    (newProduct: Omit<IProductWithUI, "id">) => {
      const product: IProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`, // 상품 고유 아이디
      };
      addProduct(product);
      addNotification(MESSAGES.PRODUCT.ADDED, "success");
    },
    [addNotification]
  );

  // 상품 수정
  const updateProductItem = useCallback(
    (productId: string, updates: Partial<IProductWithUI>) => {
      updateProduct(productId, updates);
      addNotification(MESSAGES.PRODUCT.UPDATED, "success");
    },
    [addNotification]
  );

  // 상품 추가 (수정) 처리 submit 함수
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== "new") {
      // 상품 수정 처리
      updateProductItem(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      // 상품 추가 처리
      addProductItem({
        ...productForm,
        discounts: productForm.discounts,
      });
    }
    // 작성하던 상품 폼 값 지움
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    // 수정 완료 처리
    setEditingProduct(null);
    // 상품 작성 폼 숨기기
    setShowProductForm(false);
  };

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      {/* 상품 생성 폼 */}
      <form onSubmit={handleProductSubmit} className="space-y-4">
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
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  name: e.target.value,
                })
              }
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
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  description: e.target.value,
                })
              }
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
              onChange={(e) => {
                const value = validator.validateNumericString(e.target.value);
                if (value === null) return;

                const price = value === "" ? 0 : parseInt(value);
                setProductForm({ ...productForm, price });
              }}
              onBlur={(e) => {
                const inputValue = validator.validateNumericString(e.target.value);
                if (inputValue === null) return;

                const value = inputValue === "" ? 0 : parseInt(inputValue);

                const { isValid, message, correctedValue } =
                  validator.isValidPrice(value);

                if (!isValid) addNotification(message, "error");
                setProductForm({ ...productForm, price: correctedValue });
              }}
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
              onChange={(e) => {
                const value = validator.validateNumericString(e.target.value);
                if (value === null) return;

                const stock = value === "" ? 0 : parseInt(value);
                setProductForm({ ...productForm, stock });
              }}
              onBlur={(e) => {
                const inputValue = validator.validateNumericString(e.target.value);
                if (inputValue === null) return;

                const value = inputValue === "" ? 0 : parseInt(inputValue);

                const { isValid, message, correctedValue } =
                  validator.isValidStock(value);

                if (!isValid) addNotification(message, "error");
                setProductForm({ ...productForm, stock: correctedValue });
              }}
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
                  onChange={(e) => {
                    const newDiscounts = [...productForm.discounts];
                    newDiscounts[index].quantity =
                      parseInt(e.target.value) || 0;
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
                  {/* 상품 추가 - x 아이콘 */}
                  <CloseIcon />
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

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setProductForm({
                name: "",
                price: 0,
                stock: 0,
                description: "",
                discounts: [],
              });
              setShowProductForm(false);
            }}
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

export default ProductForm;
