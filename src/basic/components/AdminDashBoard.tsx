import {
  Coupon,
  CouponForm as CouponFormType,
  EditProduct,
  ProductForm,
  ProductWithUI,
  Tab,
} from "@/types/product.type";
import { Dispatch, SetStateAction } from "react";
import CouponForm from "./CouponForm";
import ProductsTab from "./ProductsTab";

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
        <section className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">쿠폰 관리</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {coupon.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 font-mono">
                        {coupon.code}
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
                          {coupon.discountType === "amount"
                            ? `${coupon.discountValue.toLocaleString()}원 할인`
                            : `${coupon.discountValue}% 할인`}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCoupon(coupon.code)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
                <button
                  onClick={() => setShowCouponForm(!showCouponForm)}
                  className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
                </button>
              </div>
            </div>

            {showCouponForm && (
              <CouponForm
                couponForm={couponForm}
                setCouponForm={setCouponForm}
                handleCouponSubmit={handleCouponSubmit}
                addNotification={addNotification}
                setShowCouponForm={setShowCouponForm}
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminDashBoard;
