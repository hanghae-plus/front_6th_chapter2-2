import { Dispatch, SetStateAction, useCallback } from "react";
import { NewProductForm } from "../types/product";
import { useNotification } from "./useNotification";
import { DISCOUNT_OPTIONS, processNumericInput, productValidation } from "../utils/productUtils";
import { useProductForm } from "./useProductForm";

interface IUseProductFormHandlersProps {
  setProductForm: Dispatch<SetStateAction<NewProductForm>>;
  setEditingProduct: Dispatch<SetStateAction<string | null>>;
  setShowProductForm: Dispatch<SetStateAction<boolean>>;
}

export const useProductFormHandlers = ({ setProductForm }: IUseProductFormHandlersProps) => {
  const { showToast } = useNotification();
  const { clearProductForm } = useProductForm();

  /** 상품 폼 업데이트 */
  const updateField = useCallback(
    <K extends keyof NewProductForm>(field: K, value: NewProductForm[K]) => {
      setProductForm((prev) => ({ ...prev, [field]: value }));
    },
    [setProductForm]
  );

  /** 상품명 입력 핸들러 */
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateField("name", e.target.value);
    },
    [updateField]
  );

  /** 설명 입력 핸들러 */
  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateField("description", e.target.value);
    },
    [updateField]
  );

  /** 가격 입력 (숫자만 허용) */
  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const processedValue = processNumericInput(e.target.value);
      if (processedValue !== null) {
        updateField("price", processedValue);
      }
    },
    [updateField]
  );

  /** 가격 포커스 해제 시 검증 */
  const handlePriceBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const validation = productValidation.validatePrice(parseInt(e.target.value) || 0);

      if (!validation.isValid) {
        showToast(validation.message!, "error");
        updateField("price", validation.correctedValue!);
      }
    },
    [updateField, showToast]
  );

  /** 재고 입력 (숫자만 허용) */
  const handleStockChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const processedValue = processNumericInput(e.target.value);
      if (processedValue !== null) {
        updateField("stock", processedValue);
      }
    },
    [updateField]
  );

  /** 재고 포커스 해제 시 검증 */
  const handleStockBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const validation = productValidation.validateStock(parseInt(e.target.value) || 0);

      if (!validation.isValid) {
        showToast(validation.message!, "error");
        updateField("stock", validation.correctedValue!);
      }
    },
    [updateField, showToast]
  );

  /** 할인 수량 변경 */
  const handleDiscountQuantityChange = useCallback(
    (index: number, value: string) => {
      setProductForm((prev) => {
        const newDiscounts = [...prev.discounts];
        newDiscounts[index].quantity = parseInt(value) || 0;
        return { ...prev, discounts: newDiscounts };
      });
    },
    [setProductForm]
  );

  /** 할인 비율 변경 */
  const handleDiscountRateChange = useCallback(
    (index: number, value: string) => {
      setProductForm((prev) => {
        const newDiscounts = [...prev.discounts];
        newDiscounts[index].rate = (parseInt(value) || 0) / 100;
        return { ...prev, discounts: newDiscounts };
      });
    },
    [setProductForm]
  );

  /** 할인 제거 */
  const handleRemoveDiscount = useCallback(
    (index: number) => {
      setProductForm((prev) => ({
        ...prev,
        discounts: prev.discounts.filter((_, i) => i !== index),
      }));
    },
    [setProductForm]
  );

  /** 할인 추가 */
  const handleAddDiscount = useCallback(() => {
    setProductForm((prev) => ({
      ...prev,
      discounts: [...prev.discounts, DISCOUNT_OPTIONS.DEFAULT_DISCOUNT],
    }));
  }, [setProductForm]);

  /** 상품 추가 취소 - clearProductForm 사용 */
  const handleCancel = useCallback(() => {
    clearProductForm();
  }, [clearProductForm]);

  return {
    handleNameChange,
    handleDescriptionChange,
    handlePriceChange,
    handlePriceBlur,
    handleStockChange,
    handleStockBlur,
    handleDiscountQuantityChange,
    handleDiscountRateChange,
    handleRemoveDiscount,
    handleAddDiscount,
    handleCancel,
  };
};
