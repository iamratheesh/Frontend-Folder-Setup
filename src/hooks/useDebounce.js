// First install: npm install use-debounce

import { useDebounce, useDebouncedCallback } from 'use-debounce';

/**
 * Custom hook for debounced search functionality
 * @param {string} searchTerm - The search term to debounce
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @returns {string} - Debounced search term
 */
export const useSearchDebounce = (searchTerm, delay = 300) => {
  const [debouncedValue] = useDebounce(searchTerm, delay);
  return debouncedValue;
};

/**
 * Custom hook for debounced API calls
 * @param {Function} apiFunction - The API function to call
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @returns {Function} - Debounced callback function
 */
export const useApiDebounce = (apiFunction, delay = 300) => {
  const debouncedCallback = useDebouncedCallback(apiFunction, delay);
  return debouncedCallback;
};

/**
 * Custom hook for debounced form inputs
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 500)
 * @returns {any} - Debounced value
 */
export const useFormDebounce = (value, delay = 500) => {
  const [debouncedValue] = useDebounce(value, delay);
  return debouncedValue;
};
