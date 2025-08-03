import { Coupon } from '@/models/coupon';
import { discountTypeSchema } from '@/models/discount';
import { ProductView } from '@/models/product';
import {
  useCartService,
  useCouponService,
  useNotificationService,
  useProductService
} from '@/services';
import { useForm } from '@/shared/hooks';
import { useCallback, useState } from 'react';
import z from 'zod';
import { useProductForm } from './hooks/useProductForm';

const productFormSchema = z.object({
  name: z.string(),
  price: z.number(),
  stock: z.number(),
  description: z.string(),
  discounts: z.array(z.object({ quantity: z.number(), rate: z.number() }))
});

const couponFormSchema = z.object({
  name: z.string(),
  code: z.string(),
  discountType: discountTypeSchema,
  discountValue: z.number()
});

export const useAdminViewModel = () => {
  const [showCouponForm, setShowCouponForm] = useState(false);
  const notificationService = useNotificationService();

  const cartService = useCartService({
    addNotification: notificationService.addNotification
  });
  const couponService = useCouponService({
    addNotification: notificationService.addNotification
  });
  const productService = useProductService();

  const {
    form: productForm,
    showForm: showProductForm,
    editingProduct,
    setShowForm: setShowProductForm,
    updateForm: updateProductForm,
    resetForm: resetProductForm,
    startEdit: startEditProduct,
    handleChange
  } = useProductForm();

  const { form: couponForm, updateForm: updateCouponForm } = useForm<
    z.infer<typeof couponFormSchema>
  >({
    name: '',
    code: '',
    discountType: discountTypeSchema.enum.amount,
    discountValue: 0
  });

  const formatProductPrice = useCallback(
    (price: number, productId: string) => {
      return productService.formatPrice(
        price,
        productId,
        cartService.getCart()
      );
    },
    [productService.formatPrice, cartService.getCart()]
  );

  const validateProductForm = (product: ProductView) => {
    return productFormSchema.safeParse(product);
  };

  const validateCouponForm = (coupon: Coupon) => {
    return couponFormSchema.safeParse(coupon);
  };

  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductView>) => {
      productService.updateProduct(productId, updates);
      notificationService.addNotification('상품이 수정되었습니다.', 'success');
    },
    [notificationService.addNotification]
  );

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct !== 'new') {
      updateProduct(editingProduct, productForm);
    } else {
      productService.addProduct({
        ...productForm,
        discounts: productForm.discounts
      });
    }
    resetProductForm();
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    couponService.addCoupon(couponForm);
    updateCouponForm({
      name: '',
      code: '',
      discountType: 'amount',
      discountValue: 0
    });
    setShowCouponForm(false);
  };

  return {
    // state
    coupons: couponService.getCoupons(),
    showCouponForm,
    showProductForm,
    products: productService.getProducts(),

    productForm,
    handleChangeProductForm: handleChange,
    updateProductForm,
    resetProductForm,
    couponForm,
    updateCouponForm,
    validateProductForm,
    validateCouponForm,

    startEditProduct,
    formatPrice: formatProductPrice,
    handleProductSubmit,
    handleCouponSubmit,

    setShowProductForm,
    hideProductForm: () => setShowProductForm(false),
    hideCouponForm: () => setShowCouponForm(false),

    removeCouponByCode: couponService.removeCouponByCode,
    deleteProduct: productService.removeProductById
  };
};
