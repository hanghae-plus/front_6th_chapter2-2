import { useForm } from "@shared";
import { Coupon, DiscountType } from "@/types";
import {
  validateCoupon,
  validateDiscountValue,
} from "@entities/coupon/libs/validator";

interface UseCouponFormProps<T = Omit<Coupon, "id">> {
  onSubmit: (coupon: T) => void;
  initialCoupon?: Partial<Coupon>;
}

export function useCouponForm<T = Omit<Coupon, "id">>({
  onSubmit,
  initialCoupon,
}: UseCouponFormProps<T>) {
  const form = useForm({
    initialValues: {
      name: initialCoupon?.name || "",
      code: initialCoupon?.code || "",
      discountType: initialCoupon?.discountType || DiscountType.AMOUNT,
      discountValue: initialCoupon?.discountValue || 0,
    },
    validate: validateCoupon,
    onSubmit: (values) => {
      const couponData = initialCoupon
        ? { ...initialCoupon, ...values }
        : values;

      onSubmit(couponData as T);
    },
  });

  const handleDiscountValueBlur = (value: string) => {
    const numValue = parseInt(value) || 0;
    const { discountType } = form.values;

    const validation = validateDiscountValue(numValue, discountType);

    if (!validation.valid && validation.correctedValue !== undefined) {
      form.handleFieldChange("discountValue", validation.correctedValue);
      return validation.error;
    }

    return undefined;
  };

  return {
    ...form,
    handleDiscountValueBlur,
  };
}
