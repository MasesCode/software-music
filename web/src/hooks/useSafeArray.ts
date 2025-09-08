import { useState, useEffect } from 'react';

/**
 * Hook para lidar com arrays de forma segura, evitando erros de .map() em dados undefined/null
 */
export function useSafeArray<T>(initialValue: T[] = []) {
  const [array, setArray] = useState<T[]>(initialValue);

  const safeSetArray = (newArray: T[] | undefined | null) => {
    if (Array.isArray(newArray)) {
      setArray(newArray);
    } else {
      setArray([]);
    }
  };

  const safeMap = <U>(
    callback: (item: T, index: number) => U
  ): U[] => {
    if (!Array.isArray(array)) {
      return [];
    }
    return array.map(callback);
  };

  const safeFilter = (
    callback: (item: T, index: number) => boolean
  ): T[] => {
    if (!Array.isArray(array)) {
      return [];
    }
    return array.filter(callback);
  };

  const safeLength = Array.isArray(array) ? array.length : 0;

  const isEmpty = safeLength === 0;

  return {
    array,
    setArray: safeSetArray,
    map: safeMap,
    filter: safeFilter,
    length: safeLength,
    isEmpty,
  };
}
