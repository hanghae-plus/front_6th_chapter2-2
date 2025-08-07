import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Product } from "../../types";
import { ProductNotFoundError, DuplicateProductNameError, ProductValidationError } from "../errors/Product.error";

// 초기 데이터
const initialProducts: Product[] = [
  {
    id: "p1",
    name: "상품1",
    price: 10000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.1 },
      { quantity: 20, rate: 0.2 },
    ],
    description: "최고급 품질의 프리미엄 상품입니다.",
  },
  {
    id: "p2",
    name: "상품2",
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
    description: "다양한 기능을 갖춘 실용적인 상품입니다.",
    isRecommended: true,
  },
  {
    id: "p3",
    name: "상품3",
    price: 30000,
    stock: 20,
    discounts: [
      { quantity: 10, rate: 0.2 },
      { quantity: 30, rate: 0.25 },
    ],
    description: "대용량과 고성능을 자랑하는 상품입니다.",
  },
];

// 상품 상태 atom (localStorage와 연동)
export const productsAtom = atomWithStorage<Product[]>("products", initialProducts);

// 상품 추가하는 atom
export const addProductAtom = atom(null, (get, set, newProduct: Omit<Product, "id">) => {
  const products = get(productsAtom);

  // 상품명 중복 검사
  const existingProduct = products.find((p) => p.name === newProduct.name);
  if (existingProduct) {
    throw new DuplicateProductNameError(newProduct.name);
  }

  // 상품 유효성 검사
  if (newProduct.price < 0) {
    throw new ProductValidationError("상품 가격은 0원 이상이어야 합니다.");
  }

  if (newProduct.stock < 0) {
    throw new ProductValidationError("상품 재고는 0개 이상이어야 합니다.");
  }

  const product: Product = {
    ...newProduct,
    id: `product_${Math.random().toString(36).substring(2, 15)}`,
  };

  set(productsAtom, (prev) => [...prev, product]);
});

// 상품 수정하는 atom
export const updateProductAtom = atom(
  null,
  (get, set, { productId, updates }: { productId: string; updates: Partial<Product> }) => {
    const products = get(productsAtom);

    // 상품 존재 여부 확인
    const existingProduct = products.find((p) => p.id === productId);
    if (!existingProduct) {
      throw new ProductNotFoundError(productId);
    }

    // 상품명 중복 검사 (다른 상품과 중복되지 않도록)
    if (updates.name) {
      const duplicateProduct = products.find((p) => p.name === updates.name && p.id !== productId);
      if (duplicateProduct) {
        throw new DuplicateProductNameError(updates.name);
      }
    }

    // 유효성 검사
    if (updates.price !== undefined && updates.price < 0) {
      throw new ProductValidationError("상품 가격은 0원 이상이어야 합니다.");
    }

    if (updates.stock !== undefined && updates.stock < 0) {
      throw new ProductValidationError("상품 재고는 0개 이상이어야 합니다.");
    }

    set(productsAtom, (prev) =>
      prev.map((product) => (product.id === productId ? { ...product, ...updates } : product))
    );
  }
);

// 상품 삭제하는 atom
export const deleteProductAtom = atom(null, (get, set, productId: string) => {
  const products = get(productsAtom);

  // 상품 존재 여부 확인
  const existingProduct = products.find((p) => p.id === productId);
  if (!existingProduct) {
    throw new ProductNotFoundError(productId);
  }

  set(productsAtom, (prev) => prev.filter((p) => p.id !== productId));
});
