import { cva } from 'class-variance-authority';

export const buttonStyle = cva('', {
  variants: {
    variant: {
      primary: 'bg-gray-800 text-white rounded transition-colors',
      secondary:
        'border border-gray-300  text-sm font-medium text-gray-700 hover:bg-gray-50',
      ghost: 'focus:outline-none focus:border-blue-500'
    },
    size: {
      large: 'px-4 py-2 rounded-lg',
      small: 'px-3 py-1.5 rounded-md'
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'large'
  }
});
