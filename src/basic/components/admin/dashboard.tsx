import {
  Coupon,
  CouponForm as CouponFormType,
  EditProduct,
  ProductForm,
  ProductWithUI,
  Tab,
} from "@/types/product.type";
import { Dispatch, SetStateAction } from "react";
import CouponSelector from "./coupon";
import ProductsTab from "./product";

type Props = {
  activeTab: Tab;
  setActiveTab: Dispatch<SetStateAction<Tab>>;
  setEditingProduct: Dispatch<SetStateAction<EditProduct>>;
  setProductForm: Dispatch<SetStateAction<ProductForm>>;
  setShowProductForm: Dispatch<SetStateAction<boolean>>;
  setShowCouponForm: Dispatch<SetStateAction<boolean>>;
  showCouponForm: boolean;
  products: ProductWithUI[];
  coupons: Coupon[];
  couponForm: CouponFormType;
  setCouponForm: Dispatch<SetStateAction<CouponFormType>>;
  formatPrice: (price: number, productId?: string) => string;
  startEditProduct: (product: ProductWithUI) => void;
  deleteProduct: (productId: string) => void;
  handleProductSubmit: (e: React.FormEvent) => void;
  handleCouponSubmit: (e: React.FormEvent) => void;
  deleteCoupon: (couponCode: string) => void;
  showProductForm: boolean;
  editingProduct: EditProduct;
  productForm: ProductForm;
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
};

const AdminDashBoard = ({
  activeTab,
  setActiveTab,
  setEditingProduct,
  setProductForm,
  setShowProductForm,
  setShowCouponForm,
  showCouponForm,
  products,
  coupons,
  couponForm,
  setCouponForm,
  formatPrice,
  startEditProduct,
  deleteProduct,
  handleProductSubmit,
  handleCouponSubmit,
  deleteCoupon,
  showProductForm,
  editingProduct,
  productForm,
  addNotification,
}: Props) => {
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
        <ProductsTab
          productForm={productForm}
          addNotification={addNotification}
          products={products}
          formatPrice={formatPrice}
          startEditProduct={startEditProduct}
          deleteProduct={deleteProduct}
          showProductForm={showProductForm}
          handleProductSubmit={handleProductSubmit}
          editingProduct={editingProduct}
          activeTab={activeTab}
          setEditingProduct={setEditingProduct}
          setProductForm={setProductForm}
          setShowProductForm={setShowProductForm}
        />
      ) : (
        <CouponSelector
          setCouponForm={setCouponForm}
          handleCouponSubmit={handleCouponSubmit}
          addNotification={addNotification}
          coupons={coupons}
          deleteCoupon={deleteCoupon}
          setShowCouponForm={setShowCouponForm}
          showCouponForm={showCouponForm}
          couponForm={couponForm}
        />
      )}
    </div>
  );
};

export default AdminDashBoard;
