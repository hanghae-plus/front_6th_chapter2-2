import { useState } from "react";
import { Coupon } from "../../types";
import { ProductWithUI } from "../App";
import { ProductForm } from "../components/admin/ProductForm";
import { ProductTable } from "../components/admin/ProductTable";
import { PlusIcon, TrashIcon } from "../components/icons";
import { formatPrice } from "../utils/formatters";
import { CouponForm } from "../components/admin/CouponForm";
import Button from "../components/ui/Button";

interface AdminPageProps {
  products: ProductWithUI[];
  addProduct: (newProduct: Omit<ProductWithUI, "id">) => void;
  updateProduct: (productId: string, product: Partial<ProductWithUI>) => void;
  deleteProduct: (productId: string) => void;
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  addNotification: (
    message: string,
    type: "error" | "success" | "warning"
  ) => void;
  getProductPriceDisplay: (price: number, productId: string) => string;
}

const AdminPage = ({
  products,
  addProduct,
  updateProduct,
  deleteProduct,
  coupons,
  addCoupon,
  deleteCoupon,
  addNotification,
  getProductPriceDisplay,
}: AdminPageProps) => {
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });

  const [couponForm, setCouponForm] = useState({
    name: "",
    code: "",
    discountType: "amount" as "amount" | "percentage",
    discountValue: 0,
  });

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct && editingProduct !== "new") {
      updateProduct(editingProduct, productForm);
      setEditingProduct(null);
    } else {
      addProduct({
        ...productForm,
        discounts: productForm.discounts,
      });
    }

    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleCancelProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discounts: [],
    });
    setShowProductForm(false);
  };

  const startEditProduct = (product: ProductWithUI) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setShowProductForm(true);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addCoupon(couponForm);
    setCouponForm({
      name: "",
      code: "",
      discountType: "amount",
      discountValue: 0,
    });
    setShowCouponForm(false);
  };

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
        <section className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">상품 목록</h2>
              <Button
                onClick={() => {
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
                variant="primary"
                sizes="lg"
                className="text-sm"
              >
                새 상품 추가
              </Button>
            </div>
          </div>

          <ProductTable
            products={products}
            getProductPriceDisplay={getProductPriceDisplay}
            startEditProduct={startEditProduct}
            deleteProduct={deleteProduct}
          />
          {showProductForm && (
            <ProductForm
              editingProduct={editingProduct}
              productForm={productForm}
              setProductForm={setProductForm}
              handleProductSubmit={handleProductSubmit}
              handleCancelProduct={handleCancelProduct}
              addNotification={addNotification}
            />
          )}
        </section>
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
                            ? `${formatPrice(coupon.discountValue)}원 할인`
                            : `${coupon.discountValue}% 할인`}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCoupon(coupon.code)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors">
                <button
                  onClick={() => setShowCouponForm(!showCouponForm)}
                  className="text-gray-400 hover:text-gray-600 flex flex-col items-center"
                >
                  <PlusIcon className="w-8 h-8" />
                  <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
                </button>
              </div>
            </div>

            {showCouponForm && (
              <CouponForm
                couponForm={couponForm}
                setCouponForm={setCouponForm}
                handleCouponSubmit={handleCouponSubmit}
                handleCancelCoupon={() => setShowCouponForm(false)}
                addNotification={addNotification}
              />
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminPage;
