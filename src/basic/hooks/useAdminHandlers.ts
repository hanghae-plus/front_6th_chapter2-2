import { useCallback } from "react";
import { ProductWithUI } from "../entities/products/product.types";
import { ProductFormData } from "../entities/products/useProductForm";
import { CouponWithUI, CouponFormData } from "../entities/coupon";

interface UseAdminHandlersProps {
  addProduct: (product: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  addCoupon: (coupon: Omit<CouponWithUI, "id">) => void;
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
  productForm: ProductFormData;
  setProductForm: (form: ProductFormData) => void;
  editingProduct: string | null;
  setEditingProduct: (product: string | null) => void;
  setShowProductForm: (show: boolean) => void;
  couponForm: CouponFormData;
  closeCouponForm: () => void;
}

export const useAdminHandlers = ({
  addProduct,
  updateProduct,
  addCoupon,
  addNotification,
  productForm,
  setProductForm,
  editingProduct,
  setEditingProduct,
  setShowProductForm,
  couponForm,
  closeCouponForm,
}: UseAdminHandlersProps) => {
  const handleProductSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (editingProduct === "new") {
        addProduct({
          name: productForm.name,
          price: productForm.price,
          stock: productForm.stock,
          description: productForm.description,
          discounts: productForm.discounts,
        });
        addNotification("상품이 추가되었습니다", "success");
      } else if (editingProduct) {
        updateProduct(editingProduct, {
          name: productForm.name,
          price: productForm.price,
          stock: productForm.stock,
          description: productForm.description,
          discounts: productForm.discounts,
        });
        addNotification("상품이 수정되었습니다", "success");
      }

      setEditingProduct(null);
      setShowProductForm(false);
    },
    [
      editingProduct,
      productForm,
      addProduct,
      updateProduct,
      addNotification,
      setEditingProduct,
      setShowProductForm,
    ]
  );

  const handleCouponSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      addCoupon({
        name: couponForm.name,
        code: couponForm.code,
        discountType: couponForm.discountType,
        discountValue: couponForm.discountValue,
      });

      addNotification("쿠폰이 추가되었습니다", "success");
      closeCouponForm();
    },
    [couponForm, addCoupon, addNotification, closeCouponForm]
  );

  return {
    handleProductSubmit,
    handleCouponSubmit,
  };
};
