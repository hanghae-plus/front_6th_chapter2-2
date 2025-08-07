export function normalizeSearchTerm(searchTerm: string): string {
  return searchTerm.toLowerCase().trim();
}

export function isTextMatchSearchTerm(
  text: string,
  searchTerm: string
): boolean {
  const normalizedText = text.toLowerCase();
  const normalizedSearchTerm = normalizeSearchTerm(searchTerm);

  return normalizedText.includes(normalizedSearchTerm);
}

export function isAnyFieldMatchSearchTerm(
  searchableFields: (string | undefined)[],
  searchTerm: string
): boolean {
  if (!searchTerm.trim()) {
    return false;
  }

  return searchableFields.some((field) => {
    if (!field) return false;
    return isTextMatchSearchTerm(field, searchTerm);
  });
}

export function filterArrayBySearchTerm<T>(
  items: T[],
  searchTerm: string,
  searchFieldsExtractor: (item: T) => (string | undefined)[]
): T[] {
  if (!searchTerm.trim()) {
    return items;
  }

  return items.filter((item) => {
    const searchableFields = searchFieldsExtractor(item);
    return isAnyFieldMatchSearchTerm(searchableFields, searchTerm);
  });
}
