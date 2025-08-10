import { CartItem, Product, ValidationResult } from "../../types";
import cartModel from "../models/cart";
import productModel from "../models/product";
import { VALIDATION_LIMITS } from "../utils/constants";
import { isValidNumericInput } from "../utils/validators";
import { stockUtils } from "../utils/stockUtils";
import { priceUtils } from "../utils/priceUtils";
import { numberUtils } from "../utils/numberUtils";

export type ProductOperationResult =
  | {
      value: Product[];
      message: string;
      status: "success";
    }
  | {
      message: string;
      status: "error";
    };

const productService = {
  addNewItem: ({
    products,
    product,
  }: {
    products: Product[];
    product: Omit<Product, "id">;
  }): ProductOperationResult => {
    const newProduct = productModel.createProduct(product);
    return {
      value: [...products, newProduct],
      message: "상품이 추가되었습니다.",
      status: "success",
    };
  },

  updateProduct: ({
    products,
    productId,
    updates,
  }: {
    products: Product[];
    productId: string;
    updates: Partial<Product>;
  }): ProductOperationResult => {
    const updatedProducts = productModel.updateItem({
      products,
      productId,
      updates,
    });
    return {
      value: updatedProducts,
      message: "상품이 수정되었습니다.",
      status: "success",
    };
  },

  deleteProduct: ({
    products,
    productId,
  }: {
    products: Product[];
    productId: string;
  }): ProductOperationResult => {
    return {
      value: productModel.removeItem({ products, productId }),
      message: "상품이 삭제되었습니다.",
      status: "success",
    };
  },

  searchProduct: <T extends Product & { description?: string }>({
    products,
    searchTerm,
  }: {
    products: T[];
    searchTerm: string;
  }): T[] => {
    const filteredProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return filteredProducts;
  },

  getRemainingStock: ({
    product,
    cart,
  }: {
    product: Product;
    cart: CartItem[];
  }): number => {
    const cartItem = cartModel.findItem({ cart, productId: product.id });
    const remaining = product.stock - (cartItem?.quantity || 0);

    return numberUtils.clamp(remaining, 0, remaining);
  },

  getStockStatus: <P extends Product>({
    product,
    cart,
  }: {
    product: P;
    cart: CartItem[];
  }): {
    remainingStock: number;
    isLowStock: boolean;
    isOutOfStock: boolean;
  } => {
    const remainingStock = productService.getRemainingStock({ product, cart });
    return {
      remainingStock,
      isLowStock: productService.isLowStock(remainingStock),
      isOutOfStock: productService.isOutOfStock(remainingStock),
    };
  },

  validateProductPrice(productPrice: string): ValidationResult {
    if (productPrice === "") {
      return {
        isValid: true,
        message: "",
        value: VALIDATION_LIMITS.PRODUCT.MIN_VALUE,
      };
    }

    if (!isValidNumericInput(productPrice)) {
      return {
        isValid: false,
        message: "가격은 숫자만 입력 가능합니다.",
        value: VALIDATION_LIMITS.PRODUCT.MIN_VALUE,
      };
    }

    const price = parseInt(productPrice);
    if (!priceUtils.isValidPrice(price)) {
      return {
        isValid: false,
        message: "가격은 0보다 커야 합니다",
        value: VALIDATION_LIMITS.PRODUCT.MIN_VALUE,
      };
    }

    return { isValid: true, message: "", value: price };
  },

  validateProductStock(stockValue: string): ValidationResult {
    if (stockValue === "") {
      return {
        isValid: true,
        message: "",
        value: VALIDATION_LIMITS.PRODUCT.MIN_STOCK,
      };
    }

    if (!isValidNumericInput(stockValue)) {
      return {
        isValid: false,
        message: "재고는 숫자만 입력 가능합니다",
        value: VALIDATION_LIMITS.PRODUCT.MIN_STOCK,
      };
    }

    const stock = parseInt(stockValue);

    if (!priceUtils.isValidQuantity(stock)) {
      return {
        isValid: false,
        message: "재고는 1개 이상 99개 이하여야 합니다",
        value: VALIDATION_LIMITS.PRODUCT.MIN_STOCK,
      };
    }

    if (!stockUtils.isValidStock(stock)) {
      return {
        isValid: false,
        message: "재고는 999999개를 초과할 수 없습니다",
        value: VALIDATION_LIMITS.PRODUCT.MAX_STOCK,
      };
    }

    return { isValid: true, message: "", value: stock };
  },

  // 재고 관련 비즈니스 로직
  isLowStock(remainingStock: number): boolean {
    return remainingStock <= 5 && numberUtils.isPositive(remainingStock);
  },

  isOutOfStock(remainingStock: number): boolean {
    return remainingStock <= 0;
  },

  getStockLevel(remainingStock: number): "out" | "low" | "normal" {
    if (remainingStock <= 0) return "out";
    if (remainingStock <= 5) return "low";
    return "normal";
  },

  calculateMaxDiscountRate(discounts: any[]): number {
    if (discounts.length === 0) return 0;
    return numberUtils.findMax(discounts.map((d) => d.rate));
  },

  calculateMaxDiscountPercentage(discounts: any[]): number {
    return Math.round(this.calculateMaxDiscountRate(discounts) * 100);
  },
};

export default productService;
