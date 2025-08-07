type DirectionVariant = "row" | "column";

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  align?: "left" | "center" | "right";
  direction?: "row" | "column";
}

export default function NumberInput({
  label,
  align = "left",
  direction = "row",
  ...rest
}: NumberInputProps) {
  return (
    <div className={`${DIRECTION_VARIANTS[direction]}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type="number"
        className="w-full w-20 px-2 py-1 border rounded"
        {...rest}
      />
    </div>
  );
}

const DIRECTION_VARIANTS: Record<DirectionVariant, string> = {
  row: "flex-row",
  column: "flex-col",
} as const;
