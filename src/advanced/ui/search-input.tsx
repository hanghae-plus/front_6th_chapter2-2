interface SearchInputProps {
  searchTerm: string;
  onChange: (searchTerm: string) => void;
}

export function SearchInput({ searchTerm, onChange }: SearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className='ml-8 flex-1 max-w-md'>
      <input
        type='text'
        value={searchTerm}
        onChange={handleChange}
        placeholder='상품 검색...'
        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
      />
    </div>
  );
}
