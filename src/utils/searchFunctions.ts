export function containsValue(obj: Object, searchTerm: string | number) {
  if (obj === null || typeof obj === "undefined") {
    return false;
  }

  // Convert searchTerm to lowercase for case-insensitive search
  const lowerSearchTerm = String(searchTerm).toLowerCase();

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key as keyof typeof obj];

      if (typeof value === "object" && value !== null) {
        // If it's an object or array, recurse
        if (containsValue(value, searchTerm)) {
          return true; // Found in a nested structure
        }
      } else {
        // If it's a primitive type, check if it contains the search term
        if (String(value).toLowerCase().includes(lowerSearchTerm)) {
          return true;
        }
      }
    }
  }
  return false;
}
