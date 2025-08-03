import { ProductWithUI } from "../types";
import { validateProduct } from "../libs/validator";
import { useForm } from "../../../shared/hooks/useForm";

interface UseProductFormProps<T = Omit<ProductWithUI, "id">> {
  initialProduct?: Partial<ProductWithUI>;
  onSubmit: (product: T) => void;
}

const defaultProductValues: Partial<ProductWithUI> = {
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
};

export function useProductForm<T = Omit<ProductWithUI, "id">>({
  initialProduct,
  onSubmit,
}: UseProductFormProps<T>) {
  const form = useForm({
    initialValues: initialProduct || defaultProductValues,
    validate: validateProduct,
    onSubmit: (values) => {
      onSubmit(values as T);
    },
  });

  return {
    product: form.values,
    errors: form.errors,
    handleFieldChange: form.handleFieldChange,
    handleSubmit: form.handleSubmit,
    resetForm: form.resetForm,
    setFieldError: form.setFieldError,
  };
}
