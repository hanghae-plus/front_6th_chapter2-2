import { useState, useCallback } from 'react';
import { ProductWithUI } from '../shared/types';
import {
  parseNumericValue,
  validatePrice,
  validateStock,
  addDiscount,
  removeDiscount,
  updateDiscount,
  formToProduct,
  productToForm,
  resetProductForm,
} from '../models/productForm';
import type { ProductFormData as ProductFormDataType } from '../../types';
import { DEFAULT_PRODUCT_FORM } from '../constants/productForm';

/**
 * 상품 폼 상태와 핸들러를 관리하는 커스텀 훅
 * @returns 상품 폼 데이터와 핸들러 함수들
 */
export function useProductForm() {
  const [productForm, setProductForm] = useState<ProductFormDataType>(DEFAULT_PRODUCT_FORM);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  /**
   * 상품 이름 업데이트
   * @param name - 상품 이름
   */
  const updateName = useCallback((name: string) => {
    setProductForm((prev) => ({ ...prev, name }));
  }, []);

  /**
   * 상품 설명 업데이트
   * @param description - 상품 설명
   */
  const updateDescription = useCallback((description: string) => {
    setProductForm((prev) => ({ ...prev, description }));
  }, []);

  /**
   * 상품 가격 업데이트 (숫자 입력 검증)
   * @param value - 가격 값
   */
  const updatePrice = useCallback((value: string) => {
    const parsedValue = parseNumericValue(value);
    if (parsedValue !== null) {
      setProductForm((prev) => ({ ...prev, price: parsedValue }));
    }
  }, []);

  /**
   * 상품 재고 업데이트 (숫자 입력 검증)
   * @param value - 재고 값
   */
  const updateStock = useCallback((value: string) => {
    const parsedValue = parseNumericValue(value);
    if (parsedValue !== null) {
      setProductForm((prev) => ({ ...prev, stock: parsedValue }));
    }
  }, []);

  /**
   * 가격 유효성 검증 (onBlur 시 호출)
   * @param value - 가격 값
   * @param onError - 유효성 검증 실패 시 호출되는 콜백
   */
  const validatePriceValue = useCallback((value: string, onError: (message: string) => void) => {
    const price = value === '' ? 0 : parseInt(value);
    const validation = validatePrice(price);

    if (!validation.isValid) {
      onError(validation.message);
    }

    setProductForm((prev) => ({ ...prev, price: validation.correctedValue }));
  }, []);

  /**
   * 재고 유효성 검증 (onBlur 시 호출)
   * @param value - 재고 값
   * @param onError - 유효성 검증 실패 시 호출되는 콜백
   */
  const validateStockValue = useCallback((value: string, onError: (message: string) => void) => {
    const stock = value === '' ? 0 : parseInt(value);
    const validation = validateStock(stock);

    if (!validation.isValid) {
      onError(validation.message);
    }

    setProductForm((prev) => ({ ...prev, stock: validation.correctedValue }));
  }, []);

  /**
   * 할인 정책 추가
   */
  const addDiscountPolicy = useCallback(() => {
    setProductForm((prev) => ({
      ...prev,
      discounts: addDiscount(prev.discounts),
    }));
  }, []);

  /**
   * 할인 정책 제거
   * @param index - 제거할 할인 인덱스
   */
  const removeDiscountPolicy = useCallback((index: number) => {
    setProductForm((prev) => ({
      ...prev,
      discounts: removeDiscount(prev.discounts, index),
    }));
  }, []);

  /**
   * 할인 정책 수량 업데이트
   * @param index - 할인 인덱스
   * @param quantity - 새로운 수량
   */
  const updateDiscountQuantity = useCallback((index: number, quantity: number) => {
    setProductForm((prev) => ({
      ...prev,
      discounts: updateDiscount(prev.discounts, index, { quantity }),
    }));
  }, []);

  /**
   * 할인 정책 비율 업데이트
   * @param index - 할인 인덱스
   * @param rate - 새로운 비율
   */
  const updateDiscountRate = useCallback((index: number, rate: number) => {
    setProductForm((prev) => ({
      ...prev,
      discounts: updateDiscount(prev.discounts, index, { rate }),
    }));
  }, []);

  /**
   * 상품 편집 시작
   * @param product - 편집할 상품
   */
  const startEditProduct = useCallback((product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm(productToForm(product));
  }, []);

  /**
   * 새 상품 추가 모드 시작
   */
  const startAddProduct = useCallback(() => {
    setEditingProduct('new');
    setProductForm(resetProductForm());
  }, []);

  /**
   * 상품 폼 제출 처리
   * @param e - 이벤트
   * @param onSubmit - 상품 제출 콜백 (추가/수정)
   * @param onClose - 폼 닫기 콜백
   */
  const submitForm = useCallback(
    (
      e: React.FormEvent,
      onSubmit: (product: Omit<ProductWithUI, 'id'>, productId?: string) => void,
      onClose: () => void,
    ) => {
      e.preventDefault();
      const productData = formToProduct(productForm);

      if (editingProduct && editingProduct !== 'new') {
        onSubmit(productData, editingProduct);
      } else {
        onSubmit(productData);
      }

      setProductForm(resetProductForm());
      setEditingProduct(null);
      onClose();
    },
    [productForm, editingProduct],
  );

  /**
   * 상품 폼 초기화
   */
  const resetForm = useCallback(() => {
    setProductForm(resetProductForm());
    setEditingProduct(null);
  }, []);

  return {
    productForm,
    editingProduct,
    updateName,
    updateDescription,
    updatePrice,
    updateStock,
    validatePriceValue,
    validateStockValue,
    addDiscountPolicy,
    removeDiscountPolicy,
    updateDiscountQuantity,
    updateDiscountRate,
    startEditProduct,
    startAddProduct,
    submitForm,
    resetForm,
  };
}
