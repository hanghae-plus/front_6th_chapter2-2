import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export default function Input({ label, error, className, ...props }: InputProps) {
  // 공통 스타일만
  const baseClasses = 'border rounded px-3 py-2 text-sm';

  const inputClasses = [baseClasses, error ? 'border-red-500' : 'border-gray-300', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className='w-full'>
      {label && <label className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>}
      <input className={inputClasses} {...props} />
      {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
    </div>
  );
}
