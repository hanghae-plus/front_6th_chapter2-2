import type { VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { buttonStyle } from './button.css';
import { Props } from './button.type';
export type ButtonVariantProps = VariantProps<typeof buttonStyle>;

export const Button = ({
  className,
  variant = 'primary',
  size = 'large',
  ...props
}: Props) => {
  return (
    <button
      className={clsx(buttonStyle({ variant, size }), className)}
      {...props}
    />
  );
};
