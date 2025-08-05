import { cva } from 'class-variance-authority';

export const inputStyle = cva(
  [
    'border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono'
  ],
  {
    variants: {
      size: {
        large: 'px-4 py-2 rounded-lg',
        small: 'px-3 py-1.5 rounded-md'
      }
    },
    defaultVariants: {
      size: 'large'
    }
  }
);
