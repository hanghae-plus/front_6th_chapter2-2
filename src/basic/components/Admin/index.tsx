import React, { useState } from "react";
import ProductManagement from "./components/ProductManagement";
import CouponManagement from "./components/CouponManagement";

type Discount = {
  quantity: number;
  rate: number;
};

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Discount[];
};

type Coupon = {
  code: string;
  name: string;
  discountType: "amount" | "percentage";
  discountValue: number;
};

type ProductForm = {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Discount[];
};

type CouponForm = {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
};

type AdminProps = {
  setEditingProduct: (id: string | null) => void;
  setProductForm: (form: ProductForm) => void;
  setShowProductForm: (show: boolean) => void;
  products: Product[];
  formatPrice: (price: number, id: string) => string;
  startEditProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  showProductForm: boolean;
  handleProductSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editingProduct: string | null;
  productForm: ProductForm;
  addNotification: (msg: string, type: string) => void;
  coupons: Coupon[];
  deleteCoupon: (code: string) => void;
  showCouponForm: boolean;
  setShowCouponForm: (show: boolean) => void;
  couponForm: CouponForm;
  setCouponForm: (form: CouponForm) => void;
  handleCouponSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function Admin(props: AdminProps) {
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );
  const {
    setEditingProduct,
    setProductForm,
    setShowProductForm,
    products,
    formatPrice,
    startEditProduct,
    deleteProduct,
    showProductForm,
    handleProductSubmit,
    editingProduct,
    productForm,
    addNotification,
    coupons,
    deleteCoupon,
    showCouponForm,
    setShowCouponForm,
    couponForm,
    setCouponForm,
    handleCouponSubmit,
  } = props;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "products"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            상품 관리
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "coupons"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {activeTab === "products" ? (
        <ProductManagement
          products={products}
          activeTab={activeTab}
          showProductForm={showProductForm}
          productForm={productForm}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          setProductForm={setProductForm}
          setShowProductForm={setShowProductForm}
          startEditProduct={startEditProduct}
          deleteProduct={deleteProduct}
          handleProductSubmit={handleProductSubmit}
          addNotification={addNotification}
          formatPrice={formatPrice}
        />
      ) : (
        <CouponManagement
          coupons={coupons}
          deleteCoupon={deleteCoupon}
          showCouponForm={showCouponForm}
          setShowCouponForm={setShowCouponForm}
          couponForm={couponForm}
          setCouponForm={setCouponForm}
          handleCouponSubmit={handleCouponSubmit}
          addNotification={addNotification}
        />
      )}
    </div>
  );
}
