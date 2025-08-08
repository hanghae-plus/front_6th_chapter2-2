import { ProductFormData } from "../../pages/admin/components/ProductManagementSection";
import { multiply } from "../../utils/calculators";
import { CloseXIcon } from "../icons";
import { Input } from "../ui/Input";

interface DiscountFormProps {
  productForm: ProductFormData;
  handleChangeDiscount: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  handleAddDiscount: () => void;
  handleDeleteDiscount: (index: number) => void;
}

const DiscountForm = ({
  productForm,
  handleChangeDiscount,
  handleAddDiscount,
  handleDeleteDiscount,
}: DiscountFormProps) => {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        할인 정책
      </label>
      <div className="space-y-2">
        {productForm.discounts.map((discount, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-gray-50 p-2 rounded"
          >
            <Input.Field
              type="number"
              value={discount.quantity}
              fullWidth={false}
              sizes="sm"
              name="quantity"
              onChange={(e) => handleChangeDiscount(e, index)}
              className="w-20"
              min="1"
              placeholder="수량"
            />
            <span className="text-sm">개 이상 구매 시</span>
            <Input.Field
              type="number"
              value={multiply(discount.rate, 100)}
              fullWidth={false}
              sizes="sm"
              name="rate"
              onChange={(e) => handleChangeDiscount(e, index)}
              className="w-16"
              min="0"
              max="100"
              placeholder="%"
            />
            <span className="text-sm">% 할인</span>
            <button
              type="button"
              onClick={() => handleDeleteDiscount(index)}
              className="text-red-600 hover:text-red-800"
            >
              <CloseXIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddDiscount}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          + 할인 추가
        </button>
      </div>
    </div>
  );
};

export default DiscountForm;
