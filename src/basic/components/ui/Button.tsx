import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const Button = ({ onClick, className, children, ...rest }: ButtonProps) => {
  return (
    <button onClick={onClick} className={className} {...rest}>
      {children}
    </button>
  );
};

export default Button;
