// src/hooks/useQueryStrings.ts
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A custom hook to get values from the URL query string.
 * It merges URL parameters with a set of initial default values.
 * It also intelligently parses numbers and booleans from the URL string
 * based on the type of the initial value.
 *
 * @param initialValues An object representing the default state of your query params.
 * @returns An object with the same shape as initialValues, but with values
 * overridden by any matching params found in the URL.
 */
export const useQueryStrings = <T extends Record<string, any>>(
  initialValues: T
): T => {
  const { search } = useLocation();

  const queryParams = useMemo(() => {
    const params = new URLSearchParams(search);
    // Start with a copy of the initial values
    const resolvedValues: T = { ...initialValues };

    // Iterate over the keys of the initialValues object
    for (const key in initialValues) {
      // Check if the key is actually a property of the object
      if (Object.prototype.hasOwnProperty.call(initialValues, key)) {
        // Check if the key exists in the URL search params
        if (params.has(key)) {
          const urlValue = params.get(key) as string; // Get the string value from URL
          const initialValue = initialValues[key];

          // Attempt to parse the URL value based on the type of the initial value
          let finalValue: any = urlValue;
          if (typeof initialValue === 'boolean') {
            finalValue = urlValue === 'true';
          } else if (typeof initialValue === 'number') {
            const parsedNumber = parseFloat(urlValue);
            // Only use the parsed number if it's a valid number
            if (!isNaN(parsedNumber)) {
              finalValue = parsedNumber;
            }
          }
          
          // Assign the potentially parsed value
          resolvedValues[key] = finalValue;
        }
      }
    }

    return resolvedValues;
  }, [search, initialValues]);

  return queryParams;
};