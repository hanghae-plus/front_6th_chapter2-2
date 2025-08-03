import React from 'react';

export type sizeType = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
export type weightType = 'normal' | 'medium' | 'semibold' | 'bold';
export type colorType =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'danger'
  | 'success'
  | 'warning'
  | 'white';
interface TextProps {
  children?: React.ReactNode;
  size?: sizeType;
  weight?: weightType;
  color?: colorType;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}
// 기본 타이포그래피 텍스트 tsx 만들기
const Text = (props: TextProps) => {
  const {
    children,
    size = 'base',
    weight = 'normal',
    className,
    color = 'primary',
    as: Component = 'span',
  } = props;
  const sizeClasses = {
    xs: 'text-xs', // 쿠폰 코드, 할인율
    sm: 'text-sm', // 설명, 버튼 텍스트
    base: 'text-base', // 기본 텍스트
    lg: 'text-lg', // 섹션 제목
    xl: 'text-xl', // 큰 제목
    '2xl': 'text-2xl', // 메인 제목
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium', // 상품명, 버튼
    semibold: 'font-semibold', // 섹션 제목
    bold: 'font-bold', // 가격, 결제 금액
  };

  const colorClasses = {
    primary: 'text-gray-900', // 기본 검은색
    secondary: 'text-gray-600', // 설명 텍스트
    muted: 'text-gray-500', // 보조 텍스트
    danger: 'text-red-600', // 에러, 할인
    success: 'text-green-800', // 성공 메시지
    warning: 'text-yellow-800', // 경고
    white: 'text-white', // 흰색 텍스트
  };
  const classes =
    `${sizeClasses[size]} ${weightClasses[weight]} ${colorClasses[color]} ${className}`.trim();

  return <Component className={classes}>{children}</Component>;
};

export default Text;
