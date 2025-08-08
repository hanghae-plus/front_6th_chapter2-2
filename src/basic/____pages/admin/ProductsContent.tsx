import { useState } from "react";
import { Product } from "../../../types";
import { useNotification } from "../../___features/notification/use-notification";
import ProductTable from "./ProductTable";
import { useProducts } from "../../___features/product/use-products";
import { ProductWithUI } from "../../___features/product/types";

interface ProductForm {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

function ProductsContent() {
  const { addNotification } = useNotification();

  const { products, updateProduct, addProduct, deleteProduct } = useProducts();

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [],
  });

  const updateProductForm = (formValue: Partial<ProductForm>) => {
    setProductForm((prev) => ({ ...prev, ...formValue }));
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
  };

  const startEditProduct = (product: Product & { description?: string }) => {
    setEditingProduct(product.id);
    updateProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  const handleAddProduct = (newProduct: Omit<ProductWithUI, "id">) => {
    addProduct(newProduct);

    addNotification({
      text: "상품이 추가되었습니다.",
      type: "success",
    });
  };

  const handleUpdateProduct = (
    productId: string,
    updates: Partial<ProductWithUI>
  ) => {
    updateProduct(productId, updates);

    addNotification({
      text: "상품이 수정되었습니다.",
      type: "success",
    });
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);

    addNotification({
      text: "상품이 삭제되었습니다.",
      type: "success",
    });
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== "new") {
      handleUpdateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      handleAddProduct(productForm);
    }
    resetProductForm();
    setEditingProduct(null);
    setShowProductForm(false);
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={() => {
              setEditingProduct("new");
              resetProductForm();
              setShowProductForm(true);
            }}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <ProductTable
          products={products}
          onEditProduct={startEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      </div>
      {showProductForm && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
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
                    updateProductForm({
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
                    updateProductForm({
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
                      updateProductForm({
                        price: value === "" ? 0 : parseInt(value),
                      });
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      updateProductForm({ price: 0 });
                    } else if (parseInt(value) < 0) {
                      addNotification({
                        text: "가격은 0보다 커야 합니다",
                        type: "error",
                      });
                      updateProductForm({ price: 0 });
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
                      updateProductForm({
                        stock: value === "" ? 0 : parseInt(value),
                      });
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      updateProductForm({ stock: 0 });
                    } else if (parseInt(value) < 0) {
                      addNotification({
                        text: "재고는 0보다 커야 합니다",
                        type: "error",
                      });
                      updateProductForm({ stock: 0 });
                    } else if (parseInt(value) > 9999) {
                      addNotification({
                        text: "재고는 9999개를 초과할 수 없습니다",
                        type: "error",
                      });
                      updateProductForm({ stock: 9999 });
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
                        updateProductForm({
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
                        updateProductForm({
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
                        updateProductForm({
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
                    updateProductForm({
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
                  resetProductForm();
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

export default ProductsContent;
