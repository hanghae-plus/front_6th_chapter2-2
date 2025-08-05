import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;

  // 옵션 설정들
  hasTransition?: boolean; // transition-colors
  hasFontMedium?: boolean; // font-medium
  hasTextSm?: boolean; // text-sm
  hasRounded?: boolean; // rounded
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
  // 기본 공통 클래스
  const baseClasses = 'focus:outline-none';

  // 옵션별 클래스 추가
  const optionClasses = [
    hasTransition && 'transition-colors',
    hasFontMedium && 'font-medium',
    hasTextSm && 'text-sm',
    hasRounded && 'rounded',
  ].filter(Boolean);

  // 최종 클래스 조합
  const finalClasses = [baseClasses, ...optionClasses, className].filter(Boolean).join(' ');

  return (
    <button className={finalClasses} {...props}>
      {children}
    </button>
  );
}
