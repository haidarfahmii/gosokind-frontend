"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { customerService } from "@/features/super-admin/customer/services/customer.service";
import type {
  Customer,
  PaginationData,
} from "@/features/super-admin/customer/types/customer.types";
import { useDebounce } from "@/hooks/useDebounce";
import useUrlState from "@/hooks/useUrlState";

export const useCustomerList = () => {
  const urlState = useUrlState();
  const isInitialMount = useRef<boolean>(true);
  const fetchController = useRef<AbortController | null>(null);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [search, setSearchState] = useState(() =>
    urlState.getParam("search", ""),
  );

  const debouncedSearch = useDebounce(search, 500);

  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: urlState.getParamAsNumber("page", 1),
    limit: urlState.getParamAsNumber("limit", 10),
    totalPages: 0,
  });

  const fetchCustomers = useCallback(async () => {
    try {
      if (fetchController.current) {
        fetchController.current.abort();
      }
      fetchController.current = new AbortController();

      setLoading(true);

      const response = await customerService.getAllCustomers({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
      });

      if (response.success) {
        setCustomers(response.data || []);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        }));
      }
    } catch (error: any) {
      if (error.name === "AbortError") return;
      console.error("Failed to fetch customers:", error);
      toast.error(error.response?.data?.message || "Failed to load customers");
    } finally {
      setLoading(false);
      fetchController.current = null;
    }
  }, [pagination.page, pagination.limit, debouncedSearch]);

  // Reset page ke 1 saat search berubah
  useEffect(() => {
    if (isInitialMount.current) return;
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch]);

  // Sinkronisasi URL & trigger fetch
  useEffect(() => {
    const urlParams: Record<string, string | null> = {
      search: debouncedSearch || null,
      page: pagination.page !== 1 ? String(pagination.page) : null,
      limit: pagination.limit !== 10 ? String(pagination.limit) : null,
    };

    urlState.setParams(urlParams);
    fetchCustomers();

    isInitialMount.current = false;
  }, [fetchCustomers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => fetchController.current?.abort();
  }, []);

  return {
    customers,
    loading,
    search,
    setSearch: setSearchState,
    pagination,
    handlePageChange: (page: number) =>
      setPagination((prev) => ({ ...prev, page })),
    handleLimitChange: (limit: number) =>
      setPagination((prev) => ({ ...prev, limit, page: 1 })),
    refetch: fetchCustomers,
  };
};
