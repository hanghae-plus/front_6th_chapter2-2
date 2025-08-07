import { Dispatch, SetStateAction, useCallback } from "react";
import { useNotification } from "./useNotification";
import { Coupon } from "../../types";
import { couponHandlers, validateDiscountValue } from "../utils/couponUtils";

interface IUseCouponFormHandlersProps {
  setCouponForm: Dispatch<SetStateAction<Coupon>>;
  couponForm: Coupon;
  setShowCouponForm: Dispatch<SetStateAction<boolean>>;
  clearCouponForm: () => void;
  addCoupon: (coupon: Coupon) => void;
}

export const useCouponFormHandlers = ({ setCouponForm, couponForm, setShowCouponForm, clearCouponForm, addCoupon }: IUseCouponFormHandlersProps) => {
  /** 알림 훅 사용 */
  const { showToast } = useNotification();

  /** 쿠폰 폼 필드 업데이트 */
  const updateField = useCallback(
    (field: keyof Coupon, value: string | number) => {
      setCouponForm((prev) => ({ ...prev, [field]: value }));
    },
    [setCouponForm]
  );

  /** 쿠폰명 입력 */
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateField("name", e.target.value);
    },
    [updateField]
  );

  /** 쿠폰 코드 입력 */
  const handleCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      //자동으로 대문자로 변환
      updateField("code", e.target.value.toUpperCase());
    },
    [updateField]
  );

  /** 할인 타입 선택 */
  const handleDiscountTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateField("discountType", e.target.value as "amount" | "percentage");
    },
    [updateField]
  );

  /** 할인값 입력 */
  const handleDiscountValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const processedValue = couponHandlers.processDiscountInput(e.target.value);
      if (processedValue !== null) {
        updateField("discountValue", processedValue);
      }
    },
    [updateField]
  );

  /** 할인값 포커스 해제 시 검증 핸들러 */
  const handleDiscountValueBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const validation = validateDiscountValue(parseInt(e.target.value) || 0, couponForm.discountType);

      if (!validation.isValid) {
        showToast(validation.message!, "error");
        updateField("discountValue", validation.correctedValue!);
      }
    },
    [couponForm.discountType, updateField, showToast]
  );

  /** 취소 버튼 클릭 시 폼 초기화 */
  const handleCancel = useCallback(() => {
    setShowCouponForm(false);
    clearCouponForm();
  }, [setShowCouponForm, clearCouponForm]);

  /** 쿠폰 등록 핸들러 */
  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 쿠폰 등록하고 폼 초기화
    addCoupon(couponForm);
    handleCancel();
  };
  return {
    handleNameChange,
    handleCodeChange,
    handleDiscountTypeChange,
    handleDiscountValueChange,
    handleDiscountValueBlur,
    handleCancel,
    handleCouponSubmit,
  };
};
