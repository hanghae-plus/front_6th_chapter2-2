interface EmptyStateProps {
  searchTerm?: string;
  type: 'search' | 'cart';
}

export function EmptyState({ searchTerm, type }: EmptyStateProps) {
  if (type === 'search') {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
      </div>
    );
  }

  if (type === 'cart') {
    return (
      <div className="text-center py-8">
        <svg
          className="w-16 h-16 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
      </div>
    );
  }

  return null;
}
