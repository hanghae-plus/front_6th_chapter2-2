type ProductInfoProps = {
  name: string;
  description?: string;
};

export function ProductInfo({ name, description }: ProductInfoProps) {
  return (
    <>
      <h3 className="mb-1 font-medium text-gray-900">{name}</h3>
      {description && <p className="mb-2 line-clamp-2 text-sm text-gray-500">{description}</p>}
    </>
  );
}
