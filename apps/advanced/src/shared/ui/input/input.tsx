import clsx from 'clsx';
import { inputStyle } from './input.css';
import { Props } from './input.type';

export const Input = ({ className, size = 'large', ...props }: Props) => {
  return <input className={clsx(inputStyle({ size }), className)} {...props} />;
};
