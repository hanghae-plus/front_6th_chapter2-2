import { useState, useCallback } from "react";
import { ProductWithUI } from "../App";

export type ProductFormState = {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
};

const defaultProductForm: ProductFormState = {
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
};

export function useProductForm(initial?: Partial<ProductFormState>) {
  const [productForm, setProductForm] = useState<ProductFormState>({
    ...defaultProductForm,
    ...initial,
  });

  const resetProductForm = useCallback(() => {
    setProductForm(defaultProductForm);
  }, []);

  const setFormFromProduct = useCallback((product: ProductWithUI) => {
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
  }, []);

  const addDiscount = useCallback(() => {
    setProductForm((prev) => ({
      ...prev,
      discounts: [...prev.discounts, { quantity: 10, rate: 0.1 }],
    }));
  }, []);

  const updateDiscountAt = useCallback(
    (index: number, update: Partial<{ quantity: number; rate: number }>) => {
      setProductForm((prev) => {
        const newDiscounts = [...prev.discounts];
        newDiscounts[index] = { ...newDiscounts[index], ...update };
        return { ...prev, discounts: newDiscounts };
      });
    },
    []
  );

  const removeDiscountAt = useCallback((index: number) => {
    setProductForm((prev) => ({
      ...prev,
      discounts: prev.discounts.filter((_, i) => i !== index),
    }));
  }, []);

  return {
    productForm,
    setProductForm,
    resetProductForm,
    setFormFromProduct,
    addDiscount,
    updateDiscountAt,
    removeDiscountAt,
  };
}
