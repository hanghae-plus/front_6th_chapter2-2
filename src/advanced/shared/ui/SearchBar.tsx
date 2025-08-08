interface SearchBarProps {
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({
  placeholder = "검색...",
  className = "",
  value,
  onChange,
}: SearchBarProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ${className}`}
    />
  );
}
