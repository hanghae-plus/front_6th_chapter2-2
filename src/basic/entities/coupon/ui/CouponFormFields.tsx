import { DiscountType } from "../../../../types";

interface CouponFormFieldsProps {
  values: {
    name: string;
    code: string;
    discountType: DiscountType;
    discountValue: number;
  };
  onChange: (field: keyof CouponFormFieldsProps["values"], value: any) => void;
  onDiscountValueBlur: (value: string) => void;
  isEditMode?: boolean;
}

export function CouponFormFields({
  values,
  onChange,
  onDiscountValueBlur,
  isEditMode = false,
}: CouponFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          쿠폰명
        </label>
        <input
          type="text"
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
          placeholder="신규 가입 쿠폰"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          쿠폰 코드
        </label>
        <input
          type="text"
          value={values.code}
          onChange={(e) => onChange("code", e.target.value.toUpperCase())}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono"
          placeholder="WELCOME2024"
          disabled={isEditMode}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          할인 타입
        </label>
        <select
          value={values.discountType}
          onChange={(e) =>
            onChange("discountType", e.target.value as DiscountType)
          }
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
        >
          <option value={DiscountType.AMOUNT}>정액 할인</option>
          <option value={DiscountType.PERCENTAGE}>정률 할인</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {values.discountType === DiscountType.AMOUNT
            ? "할인 금액"
            : "할인율(%)"}
        </label>
        <input
          type="text"
          value={values.discountValue === 0 ? "" : values.discountValue}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^\d+$/.test(value)) {
              onChange("discountValue", value === "" ? 0 : parseInt(value));
            }
          }}
          onBlur={(e) => onDiscountValueBlur(e.target.value)}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
          placeholder={
            values.discountType === DiscountType.AMOUNT ? "5000" : "10"
          }
          required
        />
      </div>
    </div>
  );
}
