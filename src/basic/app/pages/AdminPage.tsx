import { type Dispatch, FormEvent, type SetStateAction, useState } from "react";

import type { CartItem, Coupon } from "../../../types";
import { useCouponActions } from "../../domains/coupon";
import {
  formatPrice,
  type ProductForm,
  type ProductWithUI,
  useProductActions
} from "../../domains/product";
import { CouponManagementSection, ProductManagementSection } from "../components";
import { AdminTabs } from "../components";

type AdminPageProps = {
  products: ProductWithUI[];
  setProducts: Dispatch<SetStateAction<ProductWithUI[]>>;
  coupons: Coupon[];
  setCoupons: Dispatch<SetStateAction<Coupon[]>>;
  cart: CartItem[];
  isAdminMode: boolean;
  addNotification: (message: string, type?: "error" | "success" | "warning") => void;
};

export function AdminPage({
  products,
  setProducts,
  coupons,
  setCoupons,
  cart,
  isAdminMode,
  addNotification
}: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<"products" | "coupons">("products");
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: []
  });
  const [couponForm, setCouponForm] = useState({
    name: "",
    code: "",
    discountType: "amount" as "amount" | "percentage",
    discountValue: 0
  });

  const { deleteProduct, handleProductSubmit, startEditProduct } = useProductActions({
    setProducts,
    addNotification
  });

  const { deleteCoupon, handleCouponSubmit } = useCouponActions({
    coupons,
    selectedCoupon: null,
    setCoupons,
    setSelectedCoupon: () => {},
    addNotification
  });

  const formatPriceWithContext = (price: number, productId?: string) => {
    return formatPrice(price, productId, products, cart, isAdminMode);
  };

  const handleProductSubmitWrapper = (e: FormEvent) => {
    e.preventDefault();
    handleProductSubmit(
      productForm,
      editingProduct,
      () => setProductForm({ name: "", price: 0, stock: 0, description: "", discounts: [] }),
      setEditingProduct,
      setShowProductForm
    );
  };

  const handleCouponSubmitWrapper = (e: FormEvent) => {
    e.preventDefault();
    handleCouponSubmit(
      couponForm,
      () =>
        setCouponForm({
          name: "",
          code: "",
          discountType: "amount",
          discountValue: 0
        }),
      setShowCouponForm
    );
  };

  const startEditProductWrapper = (product: ProductWithUI) => {
    startEditProduct(product, setEditingProduct, setProductForm, setShowProductForm);
  };

  const handleAddNewProduct = () => {
    setEditingProduct("new");
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: []
    });
    setShowProductForm(true);
  };

  const handleCancelProductForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: []
    });
    setShowProductForm(false);
  };

  const handleToggleCouponForm = () => {
    setShowCouponForm(!showCouponForm);
  };

  const handleCancelCouponForm = () => {
    setShowCouponForm(false);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="mt-1 text-gray-600">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "products" ? (
        <ProductManagementSection
          products={products}
          productForm={productForm}
          editingProduct={editingProduct}
          showProductForm={showProductForm}
          formatPrice={formatPriceWithContext}
          onAddNew={handleAddNewProduct}
          onEdit={startEditProductWrapper}
          onDelete={deleteProduct}
          onFormSubmit={handleProductSubmitWrapper}
          onFormCancel={handleCancelProductForm}
          onFormChange={setProductForm}
          addNotification={addNotification}
        />
      ) : (
        <CouponManagementSection
          coupons={coupons}
          couponForm={couponForm}
          showCouponForm={showCouponForm}
          onToggleForm={handleToggleCouponForm}
          onDelete={deleteCoupon}
          onFormSubmit={handleCouponSubmitWrapper}
          onFormCancel={handleCancelCouponForm}
          onFormChange={setCouponForm}
          addNotification={addNotification}
        />
      )}
    </div>
  );
}
