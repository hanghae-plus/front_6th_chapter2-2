import * as React from "react";

import { CartIcon } from "@/advanced/shared/components/icons/CartIcon";
import CloseIcon from "@/advanced/shared/components/icons/CloseIcon";
import ImageIcon from "@/advanced/shared/components/icons/ImageIcon";
import { MinusIcon } from "@/advanced/shared/components/icons/MinusIcon";
import PlusIcon from "@/advanced/shared/components/icons/PlusIcon";
import { ShopIcon } from "@/advanced/shared/components/icons/ShopIcon";
import { ShopThin } from "@/advanced/shared/components/icons/ShopThin";
import TrashIcon from "@/advanced/shared/components/icons/TrashIcon";

type IconType =
  | "cart"
  | "shop"
  | "shopThin"
  | "minus"
  | "image"
  | "close"
  | "plus"
  | "trash";

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
  image: ImageIcon,
  close: CloseIcon,
  plus: PlusIcon,
  trash: TrashIcon,
} as const;

export default Icon;
