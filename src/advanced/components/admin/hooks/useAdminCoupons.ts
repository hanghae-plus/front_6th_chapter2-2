import { useState } from "react";
import { useAtom } from "jotai";
import { CouponCreationPayload } from "../../../types";
import { couponsAtom } from "../../../store/atoms/couponAtoms";
import {
  handleAddCouponAtom,
  handleRemoveCouponAtom,
} from "../../../store/actions/couponActions";

/**
 * 어드민 페이지 쿠폰 관련 모든 상태와 액션을 캡슐화하는 커스텀 훅.
 */

export const useAdminCoupons = () => {
  const [coupons] = useAtom(couponsAtom);
  const [, addCoupon] = useAtom(handleAddCouponAtom);
  const [, removeCoupon] = useAtom(handleRemoveCouponAtom);

  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState<CouponCreationPayload>({
    name: "",
    code: "",
    discountType: "amount",
    discountValue: 0,
  });
  const [validationError, setValidationError] = useState<string>("");

  // 새로운 쿠폰 추가 함수
  const onCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      couponForm.discountType === "percentage" &&
      couponForm.discountValue > 100
    ) {
      setValidationError("할인율은 100%를 초과할 수 없습니다");
      return;
    }

    setValidationError("");

    addCoupon({
      ...couponForm,
      discountValue: couponForm.discountValue,
    });

    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

  // 쿠폰 삭제 함수
  const handleDeleteCoupon = (couponCode: string) => {
    removeCoupon(couponCode);
  };

  // 쿠폰 폼 토글 함수
  const onToggleCouponForm = () => {
    setShowCouponForm(!showCouponForm);
  };

  // 폼 입력값 변경 핸들러
  const onCouponNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponForm({ ...couponForm, name: e.target.value });
  };

  // 쿠폰 코드 입력값 변경 핸들러
  const onCouponCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() });
  };

  // 할인 타입 변경 핸들러
  const onDiscountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCouponForm({
      ...couponForm,
      discountType: e.target.value as "amount" | "percentage",
    });
    setValidationError("");
  };

  // 할인 값 입력 핸들러
  const onDiscountValueInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setCouponForm({
        ...couponForm,
        discountValue: value === "" ? 0 : parseInt(value),
      });
      if (
        couponForm.discountType === "percentage" &&
        (value === "" || parseInt(value) > 100)
      ) {
        setValidationError("할인율은 100%를 초과할 수 없습니다");
      } else {
        setValidationError("");
      }
    }
  };

  // 할인 값 입력 필드 블러 핸들러 (포커스 잃었을 때)
  const onDiscountValueBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (couponForm.discountType === "percentage" && parseInt(value) > 100) {
      setValidationError("할인율은 100%를 초과할 수 없습니다");
    }
  };

  // 폼 취소 버튼 클릭 핸들러
  const onCancelClick = () => {
    setShowCouponForm(false);
    setValidationError("");
  };

  return {
    coupons,
    showCouponForm,
    couponForm,
    validationError,
    onCouponSubmit,
    handleDeleteCoupon,
    onToggleCouponForm,
    onCouponNameChange,
    onCouponCodeChange,
    onDiscountValueBlur,
    onDiscountTypeChange,
    onDiscountValueInputChange,
    onCancelClick,
  };
};
