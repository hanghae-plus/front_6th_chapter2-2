import * as React from "react";

import { CartIcon } from "@/basic/shared/components/icons/CartIcon";
import { MinusIcon } from "@/basic/shared/components/icons/MinusIcon";
import { ShopIcon } from "@/basic/shared/components/icons/ShopIcon";
import { ShopThin } from "@/basic/shared/components/icons/ShopThin";

type IconType = "cart" | "shop" | "shopThin" | "minus";

export interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: IconType;
}

export interface SubIconProps {
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  size = 6,
  color = "text-gray-700",
  className = "",
  onClick,
  disabled = false,
  type = "cart",
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick?.();
    }
  };

  const baseClasses = `w-${size} h-${size} ${color} ${className}`;
  const interactiveClasses = onClick
    ? "cursor-pointer hover:scale-105 transition-transform"
    : "";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  const IconComponent = ICONS[type];

  return (
    <svg
      className={`${baseClasses} ${disabledClasses} ${interactiveClasses} ${color}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      onClick={handleClick}
    >
      <IconComponent />
    </svg>
  );
};

const ICONS: Record<IconType, React.FC<IconProps>> = {
  cart: CartIcon,
  shop: ShopIcon,
  shopThin: ShopThin,
  minus: MinusIcon,
} as const;

export default Icon;
