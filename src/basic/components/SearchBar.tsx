import { ComponentPropsWithoutRef } from "react";

interface SearchBarProps extends ComponentPropsWithoutRef<"input"> {}

const SearchBar = ({ ...props }: SearchBarProps) => {
  return (
    <div className="ml-8 flex-1 max-w-md">
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        {...props}
      />
    </div>
  );
};

export default SearchBar;
