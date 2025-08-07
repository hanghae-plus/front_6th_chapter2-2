import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;

  hasTransition?: boolean;
  hasFontMedium?: boolean;
  hasTextSm?: boolean;
  hasRounded?: boolean;
}

export default function Button({
  children,
  className,
  hasTransition = false,
  hasFontMedium = false,
  hasTextSm = false,
  hasRounded = false,
  ...props
}: ButtonProps) {
  const baseClasses = 'focus:outline-none';

  const optionClasses = [
    hasTransition && 'transition-colors',
    hasFontMedium && 'font-medium',
    hasTextSm && 'text-sm',
    hasRounded && 'rounded',
  ].filter(Boolean);

  const finalClasses = [baseClasses, ...optionClasses, className].filter(Boolean).join(' ');

  return (
    <button className={finalClasses} {...props}>
      {children}
    </button>
  );
}
