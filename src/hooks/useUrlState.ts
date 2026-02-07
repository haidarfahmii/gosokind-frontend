"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export interface UseUrlStateReturn {
  getParam: (key: string, defaultValue?: string) => string;
  getParamAsNumber: (key: string, defaultValue?: number) => number;
  setParam: (key: string, value: string | null) => void;
  setParams: (updates: Record<string, string | null>) => void;
  deleteParam: (key: string) => void;
  clearParams: () => void;
  getAllParams: () => Record<string, string>;
}

export function useUrlState(): UseUrlStateReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Get a URL parameter value
   */
  const getParam = useCallback(
    (key: string, defaultValue: string = ""): string => {
      return searchParams.get(key) || defaultValue;
    },
    [searchParams],
  );

  /**
   * Get a URL parameter as number
   */
  const getParamAsNumber = useCallback(
    (key: string, defaultValue: number = 0): number => {
      const value = searchParams.get(key);
      if (!value) return defaultValue;
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? defaultValue : parsed;
    },
    [searchParams],
  );

  /**
   * Set a single URL parameter
   */
  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.push(newUrl, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  /**
   * Set multiple URL parameters at once
   */
  const setParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== "") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.push(newUrl, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  /**
   * Delete a URL parameter
   */
  const deleteParam = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.push(newUrl, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  /**
   * Clear all URL parameters
   */
  const clearParams = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  /**
   * Get all URL parameters as an object
   */
  const getAllParams = useCallback((): Record<string, string> => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  return {
    getParam,
    getParamAsNumber,
    setParam,
    setParams,
    deleteParam,
    clearParams,
    getAllParams,
  };
}

export default useUrlState;
