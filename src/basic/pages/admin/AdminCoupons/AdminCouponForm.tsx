import type { Coupon } from "../../../../types"

export function AdminCouponForm({
  couponForm,
  setCouponForm,
  coupons,
  setCoupons,
  handleNotificationAdd,
  setShowCouponForm,
}: {
  couponForm: { name: string; code: string; discountType: "amount" | "percentage"; discountValue: number }
  setCouponForm: (form: { name: string; code: string; discountType: "amount" | "percentage"; discountValue: number }) => void
  coupons: Coupon[]
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>
  handleNotificationAdd: (message: string, type: "error" | "success" | "warning") => void
  setShowCouponForm: (show: boolean) => void
}) {
  function handleCouponNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCouponForm({ ...couponForm, name: e.target.value })
  }

  function handleCouponCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })
  }

  function handleCouponDiscountTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setCouponForm({ ...couponForm, discountType: e.target.value as "amount" | "percentage" })
  }

  function handleCouponDiscountValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (value === "" || /^\d+$/.test(value)) {
      setCouponForm({ ...couponForm, discountValue: value === "" ? 0 : parseInt(value) })
    }
  }

  function handleCouponDiscountValueBlur(e: React.FocusEvent<HTMLInputElement>) {
    const value = parseInt(e.target.value) || 0
    if (couponForm.discountType === "percentage") {
      if (value > 100) {
        handleNotificationAdd("할인율은 100%를 초과할 수 없습니다", "error")
        setCouponForm({ ...couponForm, discountValue: 100 })
      } else if (value < 0) {
        setCouponForm({ ...couponForm, discountValue: 0 })
      }
    } else {
      if (value > 100000) {
        handleNotificationAdd("할인 금액은 100,000원을 초과할 수 없습니다", "error")
        setCouponForm({ ...couponForm, discountValue: 100000 })
      } else if (value < 0) {
        setCouponForm({ ...couponForm, discountValue: 0 })
      }
    }
  }

  function handleCancelClick() {
    setShowCouponForm(false)
  }

  function handleCouponAdd(newCoupon: Coupon) {
    const existingCoupon = coupons.find((c) => c.code === newCoupon.code)
    if (existingCoupon) {
      handleNotificationAdd("이미 존재하는 쿠폰 코드입니다.", "error")
      return
    }

    setCoupons((prev) => [...prev, newCoupon])
    handleNotificationAdd("쿠폰이 추가되었습니다.", "success")
  }

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleCouponAdd(couponForm)
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    })
    setShowCouponForm(false)
  }

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={handleCouponSubmit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">쿠폰명</label>
            <input
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              type="text"
              value={couponForm.name}
              onChange={handleCouponNameChange}
              placeholder="신규 가입 쿠폰"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">쿠폰 코드</label>
            <input
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono"
              type="text"
              value={couponForm.code}
              onChange={handleCouponCodeChange}
              placeholder="WELCOME2024"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">할인 타입</label>
            <select
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              value={couponForm.discountType}
              onChange={handleCouponDiscountTypeChange}
            >
              <option value="amount">정액 할인</option>
              <option value="percentage">정률 할인</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {couponForm.discountType === "amount" ? "할인 금액" : "할인율(%)"}
            </label>
            <input
              type="text"
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              value={couponForm.discountValue === 0 ? "" : couponForm.discountValue}
              onChange={handleCouponDiscountValueChange}
              onBlur={handleCouponDiscountValueBlur}
              placeholder={couponForm.discountType === "amount" ? "5000" : "10"}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={handleCancelClick}
          >
            취소
          </button>

          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
            쿠폰 생성
          </button>
        </div>
      </form>
    </div>
  )
}
