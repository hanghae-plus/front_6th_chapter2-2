import { ProductFormData } from "../../pages/admin/components/ProductManagementSection";
import { Input } from "../ui/Input";

interface ProductFormProps {
  productForm: ProductFormData;
  handleChangeProduct: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlurProduct: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const ProductForm = ({
  productForm,
  handleChangeProduct,
  handleBlurProduct,
}: ProductFormProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input>
        <Input.Label>상품명</Input.Label>
        <Input.Field
          type="text"
          name="name"
          required
          value={productForm.name}
          onChange={handleChangeProduct}
        />
      </Input>
      <Input>
        <Input.Label>설명</Input.Label>
        <Input.Field
          type="text"
          name="description"
          value={productForm.description}
          onChange={handleChangeProduct}
        />
      </Input>
      <Input>
        <Input.Label>가격</Input.Label>
        <Input.Field
          type="text"
          required
          name="price"
          placeholder="숫자만 입력"
          value={productForm.price === 0 ? "" : productForm.price}
          onChange={handleChangeProduct}
          onBlur={handleBlurProduct}
        />
      </Input>
      <Input>
        <Input.Label>재고</Input.Label>
        <Input.Field
          type="text"
          required
          name="stock"
          placeholder="숫자만 입력"
          value={productForm.stock === 0 ? "" : productForm.stock}
          onChange={handleChangeProduct}
          onBlur={handleBlurProduct}
        />
      </Input>
    </div>
  );
};
