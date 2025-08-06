import { useState, useCallback } from "react";
import { Coupon } from "../../types";
import { ProductWithUI } from "../entities/products/product.types";

interface UseAdminHandlersProps {
  addProduct: (product: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  addCoupon: (coupon: Coupon) => void;
  productForm: any;
  setProductForm: any;
  editingProduct: any;
  setEditingProduct: any;
  setShowProductForm: any;
}

export const useAdminHandlers = ({
  addProduct,
  updateProduct,
  addCoupon,
  productForm,
  setProductForm,
  editingProduct,
  setEditingProduct,
  setShowProductForm,
}: UseAdminHandlersProps) => {
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    name: "",
    code: "",
    discountType: "amount" as "amount" | "percentage",
    discountValue: 0,
  });

  const handleProductSubmit = useCallback(
    (e: React.FormEvent) => {
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
      setProductForm({
        name: "",
        price: 0,
        stock: 0,
        description: "",
        discounts: [],
      });
      setEditingProduct(null);
      setShowProductForm(false);
    },
    [
      addProduct,
      updateProduct,
      editingProduct,
      productForm,
      setProductForm,
      setEditingProduct,
      setShowProductForm,
    ]
  );

  const handleCouponSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      addCoupon(couponForm);
      setCouponForm({
        name: "",
        code: "",
        discountType: "amount",
        discountValue: 0,
      });
      setShowCouponForm(false);
    },
    [addCoupon, couponForm]
  );

  return {
    activeTab,
    setActiveTab,
    showCouponForm,
    setShowCouponForm,
    couponForm,
    setCouponForm,
    handleProductSubmit,
    handleCouponSubmit,
  };
};
