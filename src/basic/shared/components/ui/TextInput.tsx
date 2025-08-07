type AlignVariant = "left" | "center" | "right";
type DirectionVariant = "row" | "column";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  align?: AlignVariant;
  direction?: DirectionVariant;
}

export default function TextInput({
  label,
  align = "left",
  direction = "row",
  ...rest
}: TextInputProps) {
  return (
    <div className={`${DIRECTION_VARIANTS[direction]}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type="text"
        {...rest}
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
      />
    </div>
  );
}

const DIRECTION_VARIANTS: Record<DirectionVariant, string> = {
  row: "flex-row",
  column: "flex-col",
} as const;
