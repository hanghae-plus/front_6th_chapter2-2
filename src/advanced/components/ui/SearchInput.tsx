import { useSearchProduct } from "../../entities/products/useSearchProduct";

export const SearchInput = () => {
  const { searchTerm, handleSearch } = useSearchProduct();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  };

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={handleChange}
      placeholder="상품 검색..."
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
    />
  );
};
