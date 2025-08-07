import { useCart } from "@/basic/features/cart/hooks/useCart";
import { Coupon } from "@/basic/features/coupon/types/coupon.type";
import { throwNotificationError } from "@/basic/features/notification/utils/notificationError.util";
import { useProducts } from "@/basic/features/product/hooks/useProducts";
import { productModel } from "@/basic/features/product/models/product.model";
import { ProductWithUI } from "@/basic/features/product/types/product";
import { DEFAULTS } from "@/basic/shared/constants/defaults";

interface ProductListRowProps {
  product: ProductWithUI;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  setEditingProduct: (productId: string | null) => void;
  setProductForm: (productForm: typeof DEFAULTS.PRODUCT_FORM) => void;
  setShowProductForm: (showProductForm: boolean) => void;
}

export default function ProductListRow({
  product,
  selectedCoupon,
  setSelectedCoupon,
  setEditingProduct,
  setProductForm,
  setShowProductForm,
}: ProductListRowProps) {
  const { products, deleteProduct } = useProducts();
  const { cart } = useCart({
    selectedCoupon,
    setSelectedCoupon,
  });

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

  const handleClickEditProduct = (product: ProductWithUI) =>
    startEditProduct(product);

  const handleClickDeleteProduct = (productId: string) => {
    deleteProduct(productId);
    throwNotificationError.success("상품이 삭제되었습니다.");
  };

  const { id, name, price, stock, description } = product;

  const formattedPrice = productModel.getFormattedProductPrice({
    productId: id,
    products,
    cart,
    isAdmin: true,
  });

  return (
    <tr key={id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formattedPrice}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            stock > 10
              ? "bg-green-100 text-green-800"
              : stock > 0
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {stock}개
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
        {description || "-"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => handleClickEditProduct(product)}
          className="text-indigo-600 hover:text-indigo-900 mr-3"
        >
          수정
        </button>
        <button
          onClick={() => handleClickDeleteProduct(id)}
          className="text-red-600 hover:text-red-900"
        >
          삭제
        </button>
      </td>
    </tr>
  );
}
