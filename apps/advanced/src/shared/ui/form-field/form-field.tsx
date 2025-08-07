import { ReactNode } from 'react';
import { Input } from '../input';

type Props = {
  label: string;
  error?: string;
  required?: boolean;
  children?: ReactNode;
  className?: string;
};

export const FormField = ({
  label,
  error,
  required = false,
  children,
  className = ''
}: Props) => {
  return (
    <div className={className}>
      <label className='block text-sm font-medium text-gray-700 mb-1'>
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </label>
      {children}
      {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
    </div>
  );
};

type InputFieldProps = Props & {
  type?: 'text' | 'number' | 'email' | 'password';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export const InputField = ({
  label,
  error,
  required = false,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  className = ''
}: InputFieldProps) => {
  return (
    <FormField
      label={label}
      error={error}
      required={required}
      className={className}>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className='w-full'
      />
    </FormField>
  );
};
