interface Props {
  children: string;
}

export function Label({ children }: Props) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {children}
    </label>
  );
}
