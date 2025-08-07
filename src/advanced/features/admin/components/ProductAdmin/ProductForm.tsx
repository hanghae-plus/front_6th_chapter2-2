import { throwNotificationError } from "@/advanced/features/notification/utils/notificationError.util";
import { useProducts } from "@/advanced/features/product/hooks/useProducts";
import Icon from "@/advanced/shared/components/icons/Icon";
import NumberInput from "@/advanced/shared/components/ui/NumberInput";
import TextInput from "@/advanced/shared/components/ui/TextInput";
import { DEFAULTS } from "@/advanced/shared/constants/defaults";
import { VALIDATION } from "@/advanced/shared/constants/validation";
import { regexUtils } from "@/advanced/shared/utils/regex.util";

interface ProductFormProps {
  editingProduct: string | null;
  productForm: typeof DEFAULTS.PRODUCT_FORM;
  setEditingProduct: (productId: string | null) => void;
  setProductForm: (productForm: typeof DEFAULTS.PRODUCT_FORM) => void;
  setShowProductForm: (showProductForm: boolean) => void;
}

export default function ProductForm({
  editingProduct,
  productForm,
  setEditingProduct,
  setProductForm,
  setShowProductForm,
}: ProductFormProps) {
  const { addProduct, updateProduct } = useProducts();

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct && editingProduct !== "new") {
      updateProduct({ id: editingProduct, updates: productForm });
      setEditingProduct(null);

      setProductForm(DEFAULTS.PRODUCT_FORM);
      setEditingProduct(null);
      setShowProductForm(false);

      throwNotificationError.success("상품이 수정되었습니다.");
      return;
    }
    addProduct({
      ...productForm,
      discounts: productForm.discounts,
    });

    setProductForm(DEFAULTS.PRODUCT_FORM);
    setEditingProduct(null);
    setShowProductForm(false);

    throwNotificationError.success("상품이 추가되었습니다.");
  };

  const handleChangeProductName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductForm({ ...productForm, name: e.target.value });
  };

  const handleChangeProductDescription = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProductForm({ ...productForm, description: e.target.value });
  };

  const handleChangeProductPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "" || regexUtils.isNumeric(value)) {
      setProductForm({
        ...productForm,
        price:
          value === "" ? VALIDATION.PRODUCT_LIMITS.MIN_PRICE : parseInt(value),
      });
    }
  };

  const handleBlurProductPrice = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setProductForm({
        ...productForm,
        price: VALIDATION.PRODUCT_LIMITS.MIN_PRICE,
      });
    } else if (parseInt(value) < VALIDATION.PRODUCT_LIMITS.MIN_PRICE) {
      setProductForm({
        ...productForm,
        price: VALIDATION.PRODUCT_LIMITS.MIN_PRICE,
      });

      throwNotificationError.error(
        `가격은 ${VALIDATION.PRODUCT_LIMITS.MIN_PRICE}보다 커야 합니다`
      );
    }
  };

  const handleChangeProductStock = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "" || regexUtils.isNumeric(value)) {
      setProductForm({
        ...productForm,
        stock:
          value === "" ? VALIDATION.PRODUCT_LIMITS.MIN_STOCK : parseInt(value),
      });
    }
  };

  const handleBlurProductStock = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setProductForm({
        ...productForm,
        stock: VALIDATION.PRODUCT_LIMITS.MIN_STOCK,
      });
    } else if (parseInt(value) < VALIDATION.PRODUCT_LIMITS.MIN_STOCK) {
      setProductForm({
        ...productForm,
        stock: VALIDATION.PRODUCT_LIMITS.MIN_STOCK,
      });

      throwNotificationError.error(
        `재고는 ${VALIDATION.PRODUCT_LIMITS.MIN_STOCK}보다 커야 합니다`
      );
    } else if (parseInt(value) > VALIDATION.PRODUCT_LIMITS.MAX_STOCK) {
      setProductForm({
        ...productForm,
        stock: VALIDATION.PRODUCT_LIMITS.MAX_STOCK,
      });

      throwNotificationError.error(
        `재고는 ${VALIDATION.PRODUCT_LIMITS.MAX_STOCK}개를 초과할 수 없습니다`
      );
    }
  };

  const handleChangeProductDiscountQuantity = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    if (!regexUtils.isNumeric(value)) return;

    const newDiscounts = productForm.discounts.map((discount, i) =>
      i === index
        ? { ...discount, quantity: value === "" ? 0 : parseInt(value, 10) }
        : discount
    );

    setProductForm({
      ...productForm,
      discounts: newDiscounts,
    });
  };

  const handleChangeProductDiscountRate = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    if (!regexUtils.isNumeric(value)) return;

    const newDiscounts = productForm.discounts.map((discount, i) =>
      i === index
        ? { ...discount, rate: (parseInt(value) || 0) / 100 }
        : discount
    );

    setProductForm({
      ...productForm,
      discounts: newDiscounts,
    });
  };

  const handleAddProductDiscount = () => {
    setProductForm({
      ...productForm,
      discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }],
    });
  };

  const handleCancelProductForm = () => {
    setEditingProduct(null);
    setProductForm(DEFAULTS.PRODUCT_FORM);
    setShowProductForm(false);
  };

  const formTitle = editingProduct === "new" ? "새 상품 추가" : "상품 수정";

  const submitButtonText = editingProduct === "new" ? "추가" : "수정";

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={handleProductSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">{formTitle}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput
            label="상품명"
            value={productForm.name}
            onChange={handleChangeProductName}
            required
          />

          <TextInput
            label="설명"
            value={productForm.description}
            onChange={handleChangeProductDescription}
          />

          <TextInput
            label="가격"
            value={productForm.price || ""}
            onChange={handleChangeProductPrice}
            onBlur={handleBlurProductPrice}
            placeholder="숫자만 입력"
            required
          />

          <TextInput
            label="재고"
            value={productForm.stock || ""}
            onChange={handleChangeProductStock}
            onBlur={handleBlurProductStock}
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
                <NumberInput
                  value={discount.quantity}
                  onChange={(e) =>
                    handleChangeProductDiscountQuantity(index, e)
                  }
                  min={1}
                  placeholder="수량"
                />
                <span className="text-sm">개 이상 구매 시</span>

                <NumberInput
                  value={discount.rate * 100}
                  onChange={(e) => handleChangeProductDiscountRate(index, e)}
                  min={0}
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
                  <Icon type="close" size={4} color="currentColor" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddProductDiscount}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              + 할인 추가
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancelProductForm}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
