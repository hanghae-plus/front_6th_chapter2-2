interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type: 'text' | 'number' | 'checkbox' | 'radio' | 'hidden';
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export default function Input({
  type = 'text',
  className = '',
  size = 'md',
  ...props
}: InputProps) {
  const sizeClasses = {
    xs: 'w-16 px-2 py-1 rounded',
    sm: 'w-20 px-2 py-1 rounded',
    md: 'w-full px-3 py-2 rounded-md shadow-sm',
    lg: '',
  };

  return (
    <input
      type={type}
      className={`border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 border ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
