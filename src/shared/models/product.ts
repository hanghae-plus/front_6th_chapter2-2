import { ProductWithUI } from '../constants/mocks';

export class ProductModel {
  constructor(private products: ProductWithUI[] = []) {}

  get productList(): ProductWithUI[] {
    return [...this.products];
  }

  get count(): number {
    return this.products.length;
  }

  filter(searchTerm: string): ProductWithUI[] {
    if (!searchTerm.trim()) {
      return this.products;
    }

    const lowercaseSearch = searchTerm.toLowerCase().trim();
    return this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseSearch) ||
        product.description?.toLowerCase().includes(lowercaseSearch)
    );
  }

  add(newProduct: Omit<ProductWithUI, 'id'>): ProductModel {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    return new ProductModel([...this.products, product]);
  }

  update(productId: string, updates: Partial<ProductWithUI>): ProductModel {
    const newProducts = this.products.map((product) =>
      product.id === productId ? { ...product, ...updates } : product
    );
    return new ProductModel(newProducts);
  }

  remove(productId: string): ProductModel {
    const newProducts = this.products.filter((product) => product.id !== productId);
    return new ProductModel(newProducts);
  }

  findById(productId: string): ProductWithUI | undefined {
    return this.products.find((product) => product.id === productId);
  }

  getAvailableProducts(): ProductWithUI[] {
    return this.products.filter((product) => product.stock > 0);
  }

  findByPriceRange(minPrice: number, maxPrice: number): ProductWithUI[] {
    return this.products.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );
  }
}
