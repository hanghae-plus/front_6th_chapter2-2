import { useCallback, useState } from "react";
import { ProductWithUI } from "../entities/products/product.types";
import { CouponWithUI } from "../entities/coupon/coupon.types";
import { useCouponHandlers } from "../entities/coupon/useCouponHandlers";
import { useProductForm } from "../entities/products/useProductForm";
import { useCouponForm } from "../entities/coupon/useCouponForm";
import {
  AdminTabs,
  ProductTable,
  ProductForm,
  CouponGrid,
  CouponForm,
} from "../components/ui/admin";

interface AdminPageProps {
  products: ProductWithUI[];
  setProducts: (products: ProductWithUI[]) => void;
  addProduct: (product: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  checkSoldOutByProductId: (productId: string) => boolean;
  isAdmin: boolean;
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
}

export const AdminPage = ({
  products,
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  checkSoldOutByProductId,
  isAdmin,
  addNotification,
}: AdminPageProps) => {
  // Coupon 핸들러들을 내부에서 관리
  const { coupons, addCoupon, deleteCoupon } = useCouponHandlers({
    addNotification,
  });

  // 내부 상태 관리
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );

  // ProductForm 관련 로직을 내부로 이동
  const {
    productForm,
    setProductForm,
    editingProduct,
    setEditingProduct,
    showProductForm,
    setShowProductForm,
    startEditProduct,
  } = useProductForm();

  // CouponForm 관련 로직
  const {
    showCouponForm,
    couponForm,
    setCouponForm,
    closeCouponForm,
    openCouponForm,
  } = useCouponForm();

  // handleProductSubmit을 내부에서 정의
  const handleProductSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (editingProduct === "new") {
        addProduct({
          name: productForm.name,
          price: productForm.price,
          stock: productForm.stock,
          description: productForm.description,
          discounts: productForm.discounts,
        });
        addNotification("상품이 추가되었습니다", "success");
      } else if (editingProduct) {
        updateProduct(editingProduct, {
          name: productForm.name,
          price: productForm.price,
          stock: productForm.stock,
          description: productForm.description,
          discounts: productForm.discounts,
        });
        addNotification("상품이 수정되었습니다", "success");
      }

      setEditingProduct(null);
      setShowProductForm(false);
    },
    [
      editingProduct,
      productForm,
      addProduct,
      updateProduct,
      addNotification,
      setEditingProduct,
      setShowProductForm,
    ]
  );

  // handleCouponSubmit을 내부에서 정의
  const handleCouponSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      addCoupon({
        name: couponForm.name,
        code: couponForm.code,
        discountType: couponForm.discountType,
        discountValue: couponForm.discountValue,
      });

      addNotification("쿠폰이 추가되었습니다", "success");
      closeCouponForm();
    },
    [couponForm, addCoupon, addNotification, closeCouponForm]
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>

      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "products" ? (
        <>
          <ProductTable
            products={products}
            checkSoldOutByProductId={checkSoldOutByProductId}
            isAdmin={isAdmin}
            onEditProduct={startEditProduct}
            onDeleteProduct={deleteProduct}
            onAddProduct={() => {
              setEditingProduct("new");
              setProductForm({
                name: "",
                price: 0,
                stock: 0,
                description: "",
                discounts: [],
              });
              setShowProductForm(true);
            }}
          />
          {showProductForm && (
            <ProductForm
              productForm={productForm}
              setProductForm={setProductForm}
              editingProduct={editingProduct}
              onSubmit={handleProductSubmit}
              onCancel={() => {
                setEditingProduct(null);
                setProductForm({
                  name: "",
                  price: 0,
                  stock: 0,
                  description: "",
                  discounts: [],
                });
                setShowProductForm(false);
              }}
              addNotification={addNotification}
            />
          )}
        </>
      ) : (
        <>
          <CouponGrid
            coupons={coupons}
            onDeleteCoupon={deleteCoupon}
            onAddCoupon={openCouponForm}
          />
          {showCouponForm && (
            <CouponForm
              couponForm={couponForm}
              setCouponForm={setCouponForm}
              onSubmit={handleCouponSubmit}
              onCancel={closeCouponForm}
              addNotification={addNotification}
            />
          )}
        </>
      )}
    </div>
  );
};
