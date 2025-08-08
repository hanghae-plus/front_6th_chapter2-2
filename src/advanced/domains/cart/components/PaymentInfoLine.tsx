import { tv } from "tailwind-variants";

const paymentInfoLine = tv({
  slots: {
    container: "flex justify-between",
    label: "",
    value: ""
  },
  variants: {
    variant: {
      default: {
        label: "text-gray-600",
        value: "font-medium"
      },
      highlighted: {
        label: "text-red-500",
        value: ""
      },
      total: {
        container: "border-t border-gray-200 py-2",
        label: "font-semibold",
        value: "text-lg font-bold text-gray-900"
      }
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

type PaymentInfoLineProps = {
  label: string;
  value: string;
  variant?: "default" | "highlighted" | "total";
};

export function PaymentInfoLine({ label, value, variant = "default" }: PaymentInfoLineProps) {
  const { container, label: labelClass, value: valueClass } = paymentInfoLine({ variant });

  return (
    <div className={container()}>
      <span className={labelClass()}>{label}</span>
      <span className={valueClass()}>{value}</span>
    </div>
  );
}
