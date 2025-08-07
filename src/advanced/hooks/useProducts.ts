import { useCallback } from "react";
import { useAtom } from "jotai";
import {
  ProductWithUI,
  createProduct,
  generateProductId,
  createProductFormFromProduct,
} from "../models/product";
import {
  Discount,
  addDiscountToList,
  removeDiscountFromList,
} from "../models/discount";
import { percentToDecimal } from "../utils/formatters";
import {
  productsAtom,
  productFormAtom,
  editingProductAtom,
} from "../atoms/appAtoms";

export const useProducts = (onSuccess: (message: string) => void) => {
  const [_products, setProducts] = useAtom(productsAtom);
  const [_productForm, setProductForm] = useAtom(productFormAtom);
  const [_editingProduct, setEditingProduct] = useAtom(editingProductAtom);

  /**
   * 새 상품 추가
   */
  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = createProduct(
        newProduct,
        generateProductId(Date.now())
      );
      setProducts((prev) => [...prev, product]);
      onSuccess(`상품 "${product.name}"이(가) 추가되었습니다.`);
    },
    [setProducts, onSuccess]
  );

  /**
   * 상품 수정
   */
  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      onSuccess("상품이 수정되었습니다.");
    },
    [setProducts, onSuccess]
  );

  /**
   * 상품 삭제
   */
  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      onSuccess("상품이 삭제되었습니다.");
    },
    [setProducts, onSuccess]
  );

  /**
   * 상품 편집 시작
   */
  const startEditProduct = useCallback((product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm(createProductFormFromProduct(product));
  }, []);

  /**
   * 할인 정보 업데이트 헬퍼 함수
   */
  const updateDiscounts = useCallback(
    (updater: (discounts: Discount[]) => Discount[]) => {
      setProductForm((prev) => ({
        ...prev,
        discounts: updater(prev.discounts),
      }));
    },
    []
  );

  /**
   * 할인 정보 직접 설정
   */
  const setProductFormDiscounts = useCallback(
    (newDiscounts: Discount[]) => {
      updateDiscounts(() => newDiscounts);
    },
    [updateDiscounts]
  );

  /**
   * 할인 추가
   */
  const handleDiscountAdd = useCallback(() => {
    updateDiscounts(addDiscountToList);
  }, [updateDiscounts]);

  /**
   * 할인 제거
   */
  const handleDiscountRemove = useCallback(
    (index: number) => {
      updateDiscounts((discounts) => removeDiscountFromList(discounts, index));
    },
    [updateDiscounts]
  );

  /**
   * 할인 수량 변경
   */
  const handleDiscountQuantityChange = useCallback(
    (index: number, quantity: number) => {
      updateDiscounts((discounts) =>
        discounts.map((discount, i) =>
          i === index ? { ...discount, quantity } : discount
        )
      );
    },
    [updateDiscounts]
  );

  /**
   * 할인율 변경
   */
  const handleDiscountRateChange = useCallback(
    (index: number, rate: number) => {
      updateDiscounts((discounts) =>
        discounts.map((discount, i) =>
          i === index ? { ...discount, rate: percentToDecimal(rate) } : discount
        )
      );
    },
    [updateDiscounts]
  );

  return {
    addProduct,
    updateProduct,
    deleteProduct,
    startEditProduct,
    handleDiscountAdd,
    handleDiscountRemove,
    handleDiscountQuantityChange,
    handleDiscountRateChange,
    updateDiscounts,
    setProductFormDiscounts,
  };
};
