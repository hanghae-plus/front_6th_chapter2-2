import { Dispatch, SetStateAction } from "react";
import Input from "../common/Input";
import { ProductForm } from "../../../types";
import { CloseIcon } from "../icons";
import { NOTIFICATION_MESSAGE } from "../../constants";
import { useSetAtom } from "jotai";
import { addNotificationAtom } from "../../atoms/notification";

interface ProductFormPanelProps {
  handleProductSubmit: (e: React.FormEvent) => void;
  editingProduct: string | null;
  setEditingProduct: Dispatch<SetStateAction<string | null>>;
  productForm: ProductForm;
  setProductForm: Dispatch<SetStateAction<ProductForm>>;
  setShowProductForm: Dispatch<SetStateAction<boolean>>;
}

const ProductFormPanel = ({
  handleProductSubmit,
  editingProduct,
  setEditingProduct,
  productForm,
  setProductForm,
  setShowProductForm,
}: ProductFormPanelProps) => {
  const addNotification = useSetAtom(addNotificationAtom);

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={handleProductSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {editingProduct === "new" ? "새 상품 추가" : "상품 수정"}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            labelText="상품명"
            type="text"
            value={productForm.name}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                name: e.target.value,
              })
            }
            required
          />
          <Input
            labelText="설명"
            type="text"
            value={productForm.description}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                description: e.target.value,
              })
            }
          />

          <Input
            labelText="가격"
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
              } else if (parseInt(value) < 0) {
                addNotification({
                  message: NOTIFICATION_MESSAGE.ERROR.MIN_PRICE,
                  type: "error",
                });
                setProductForm({ ...productForm, price: 0 });
              }
            }}
            placeholder="숫자만 입력"
            required
          />
          <Input
            labelText="재고"
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
              } else if (parseInt(value) < 0) {
                addNotification({
                  message: NOTIFICATION_MESSAGE.ERROR.MIN_STOCK,
                  type: "error",
                });
                setProductForm({ ...productForm, stock: 0 });
              } else if (parseInt(value) > 9999) {
                addNotification({
                  message: NOTIFICATION_MESSAGE.ERROR.MAX_STOCK,
                  type: "error",
                });
                setProductForm({ ...productForm, stock: 9999 });
              }
            }}
            placeholder="숫자만 입력"
            required
          />
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

export default ProductFormPanel;
