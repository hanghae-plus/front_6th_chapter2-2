import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

import { searchTermAtom } from '../../atoms';
import { useDebounce } from '../../utils/hooks/useDebounce';

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const [inputValue, setInputValue] = useState('');

  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    setSearchTerm(debouncedValue);
  }, [debouncedValue, setSearchTerm]);

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  return (
    <div className='ml-8 flex-1 max-w-md'>
      <input
        type='text'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder='상품 검색...'
        className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
      />
    </div>
  );
};
