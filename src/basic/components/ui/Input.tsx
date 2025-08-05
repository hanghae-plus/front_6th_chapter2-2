import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export default function Input({ label, className, ...props }: InputProps) {
  // 공통 스타일
  const baseClasses =
    'w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border';

  const inputClasses = [baseClasses, className].filter(Boolean).join(' ');

  return (
    <div className='w-full'>
      {label && <label className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>}
      <input className={inputClasses} {...props} />
    </div>
  );
}
