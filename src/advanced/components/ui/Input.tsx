import React from 'react';

interface InputProps {
  value: string | number;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'password';
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  className?: string;
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  disabled = false,
  required = false,
  min,
  max,
  className = '',
  label,
  error,
}) => {
  const baseClasses =
    'w-full border rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 transition-colors';
  const borderClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500';
  const paddingClasses = 'px-3 py-2';
  const disabledClasses = disabled
    ? 'bg-gray-100 cursor-not-allowed'
    : 'bg-white';

  const combinedClasses = [
    baseClasses,
    borderClasses,
    paddingClasses,
    disabledClasses,
    className,
  ].join(' ');

  return (
    <div className='w-full'>
      {label && (
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        className={combinedClasses}
      />
      {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
    </div>
  );
};
