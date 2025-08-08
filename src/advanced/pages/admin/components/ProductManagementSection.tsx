import { useState } from "react";
import Button from "../../../components/ui/Button";
import { ProductWithUI } from "../../../App";
import { ProductTable } from "../../../components/admin/ProductTable";
import { ProductForm } from "../../../components/admin/ProductForm";
import { useProductActions } from "../../../hooks/useProducts";
import { useNotificationActions } from "../../../hooks/useNotification";
import DiscountForm from "../../../components/admin/DiscountForm";
import { isNumericInput } from "../../../utils/validators";

export interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

const ProductManagementSection = () => {
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });
  const { addProduct, updateProduct } = useProductActions();
  const { addNotification } = useNotificationActions();

  const handleCancelProduct = () => {
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  const handleChangeProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "price" || name === "stock") {
      if (isNumericInput(value)) {
        setProductForm({
          ...productForm,
          [name]: value === "" ? 0 : parseInt(value),
        });
      }
    } else {
      setProductForm({
        ...productForm,
        [name]: value,
      });
    }
  };

  const handleBlurProduct = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (value === "") {
      setProductForm({ ...productForm, [name]: 0 });
      return;
    }

    if (name === "stock" && parseInt(value) > 9999) {
      addNotification("재고는 9999개를 초과할 수 없습니다", "error");
      setProductForm({ ...productForm, [name]: 9999 });
      return;
    }
  };

  const handleChangeDiscount = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const newDiscounts = [...productForm.discounts];

    if (name === "quantity") {
      newDiscounts[index].quantity = parseInt(value) || 0;
    } else {
      newDiscounts[index].rate = (parseInt(value) || 0) / 100;
    }

    setProductForm({
      ...productForm,
      discounts: newDiscounts,
    });
  };

  const handleAddDiscount = () => {
    setProductForm({
      ...productForm,
      discounts: [...productForm.discounts, { quantity: 10, rate: 0.1 }],
    });
  };

  const handleDeleteDiscount = (index: number) => {
    const newDiscounts = productForm.discounts.filter((_, i) => i !== index);

    setProductForm({
      ...productForm,
      discounts: newDiscounts,
    });
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct && editingProduct !== "new") {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }

    handleCancelProduct();
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <Button
            onClick={() => {
              setEditingProduct("new");
              setProductForm({
                name: "",
                price: 0,
                stock: 0,
                description: "",
                discounts: [],
              });
              setShowProductForm(true);
            }}
            variant="primary"
            sizes="lg"
            className="text-sm"
          >
            새 상품 추가
          </Button>
        </div>
      </div>

      <ProductTable handleEditProduct={handleEditProduct} />
      {showProductForm && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              {editingProduct === "new" ? "새 상품 추가" : "상품 수정"}
            </h3>
            <ProductForm
              productForm={productForm}
              handleChangeProduct={handleChangeProduct}
              handleBlurProduct={handleBlurProduct}
            />
            <DiscountForm
              productForm={productForm}
              handleChangeDiscount={handleChangeDiscount}
              handleAddDiscount={handleAddDiscount}
              handleDeleteDiscount={handleDeleteDiscount}
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelProduct}
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
};

export default ProductManagementSection;
