import { ProductWithUI } from "../../../../types";
import { useProductForm } from "../../../../hooks/admin/useProductForm";
import { MAX_STOCK_QUANTITY } from "../../../../constants/business";
import {
  validateAdminPrice,
  validateAdminStock,
} from "../../../../utils/validators";
import { ProductTable } from "./ProductTable";

interface ProductTabProps {
  products: ProductWithUI[];
  onAddProduct: (product: Omit<ProductWithUI, "id">) => void;
  onUpdateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  onDeleteProduct: (productId: string) => void;
  getRemainingStock: (product: ProductWithUI) => number;
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export function ProductTab({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  getRemainingStock,
  addNotification,
}: ProductTabProps) {
  const {
    productForm,
    setProductForm,
    showProductForm,
    setShowProductForm,
    editingProduct,
    setEditingProduct,
    startEditProduct,
    handleProductSubmit,
  } = useProductForm();

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={() => {
              setEditingProduct("new");
              setShowProductForm(true);
              setProductForm({
                name: "",
                price: 0,
                stock: 0,
                description: "",
                discounts: [],
              });
              setEditingProduct("new");
              setShowProductForm(true);
            }}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <ProductTable
        products={products}
        onDeleteProduct={onDeleteProduct}
        getRemainingStock={getRemainingStock}
        onEditProduct={startEditProduct}
      />

      {showProductForm && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <form
            onSubmit={(e) =>
              handleProductSubmit(e, onAddProduct, onUpdateProduct)
            }
            className="space-y-4"
          >
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
                    const value = e.target.value;
                    if (value === "" || /^\d+$/.test(value)) {
                      setProductForm({
                        ...productForm,
                        price: value === "" ? 0 : parseInt(value),
                      });
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setProductForm({ ...productForm, price: 0 });
                    } else {
                      const price = parseInt(value);
                      const validation = validateAdminPrice(price);
                      if (validation.errorMessage) {
                        addNotification(validation.errorMessage, "error");
                        setProductForm({ ...productForm, price: 0 });
                      }
                    }
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
                    const value = e.target.value;
                    if (value === "" || /^\d+$/.test(value)) {
                      setProductForm({
                        ...productForm,
                        stock: value === "" ? 0 : parseInt(value),
                      });
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setProductForm({ ...productForm, stock: 0 });
                    } else {
                      const stock = parseInt(value);
                      const validation = validateAdminStock(stock);
                      if (validation.errorMessage) {
                        addNotification(validation.errorMessage, "error");
                        if (stock < 0) {
                          setProductForm({ ...productForm, stock: 0 });
                        } else {
                          setProductForm({
                            ...productForm,
                            stock: MAX_STOCK_QUANTITY,
                          });
                        }
                      }
                    }
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
                      max={100}
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

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowProductForm(false);
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
      )}
    </section>
  );
}
