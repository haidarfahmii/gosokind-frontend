"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { Order, OrderStatus, OrderListQuery } from "../types/order.types";
import { orderService } from "../services/order.service";
import { useDebounce } from "@/hooks/useDebounce";
import { useUrlState } from "@/hooks/useUrlState";

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useOrderList = () => {
  const urlState = useUrlState();
  const isInitialMount = useRef<boolean>(true);
  const fetchController = useRef<AbortController | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State Filter
  const [search, setSearchState] = useState(() =>
    urlState.getParam("search", ""),
  );
  const [filterStatus, setFilterStatusState] = useState<string>(() =>
    urlState.getParam("status", "all"),
  );
  const [filterOutlet, setFilterOutletState] = useState(() =>
    urlState.getParam("outletId", "all"),
  );
  const [startDate, setStartDateState] = useState(() =>
    urlState.getParam("startDate", ""),
  );
  const [endDate, setEndDateState] = useState(() =>
    urlState.getParam("endDate", ""),
  );

  // Debounce search
  const debouncedSearch = useDebounce(search, 500);

  // State Pagination
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: urlState.getParamAsNumber("page", 1),
    limit: urlState.getParamAsNumber("limit", 10),
    totalPages: 0,
  });

  // Fetching
  const fetchOrders = useCallback(async () => {
    try {
      // Abort request sebelumnya jika masih berjalan
      if (fetchController.current) {
        fetchController.current.abort();
      }
      fetchController.current = new AbortController();

      setLoading(true);

      const queryParams: OrderListQuery = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (filterStatus !== "all") {
        queryParams.status = filterStatus as OrderStatus;
      }
      if (filterOutlet !== "all") {
        queryParams.outletId = filterOutlet;
      }
      if (debouncedSearch) {
        queryParams.search = debouncedSearch;
      }
      if (startDate) {
        queryParams.startDate = startDate;
      }
      if (endDate) {
        queryParams.endDate = endDate;
      }

      const response = await orderService.getAllOrders(queryParams);

      if (response.success) {
        setOrders(response.data?.orders || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data?.pagination?.total || 0,
          totalPages: response.data?.pagination?.totalPages || 0,
        }));
      }
    } catch (error: any) {
      if (error.name === "AbortError") return;
      console.error("Failed to fetch orders:", error);
      toast.error(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
      fetchController.current = null;
    }
  }, [
    pagination.page,
    pagination.limit,
    filterStatus,
    filterOutlet,
    debouncedSearch,
    startDate,
    endDate,
  ]);

  // Reset Page ke 1 jika Filter Berubah
  useEffect(() => {
    if (isInitialMount.current) return;
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [filterStatus, filterOutlet, debouncedSearch, startDate, endDate]);

  // Sinkronisasi URL & Trigger Fetch
  useEffect(() => {
    // Update URL Params
    const urlParams: Record<string, string | null> = {
      search: debouncedSearch || null,
      status: filterStatus !== "all" ? filterStatus : null,
      outletId: filterOutlet !== "all" ? filterOutlet : null,
      startDate: startDate || null,
      endDate: endDate || null,
      page: pagination.page !== 1 ? String(pagination.page) : null,
      limit: pagination.limit !== 10 ? String(pagination.limit) : null,
    };

    urlState.setParams(urlParams);
    fetchOrders();

    isInitialMount.current = false;
  }, [fetchOrders]);

  const clearFilters = () => {
    setSearchState("");
    setFilterStatusState("all");
    setFilterOutletState("all");
    setStartDateState("");
    setEndDateState("");
    setPagination((prev) => ({ ...prev, page: 1, limit: 10 }));
  };

  // Cleanup
  useEffect(() => {
    return () => fetchController.current?.abort();
  }, []);

  return {
    orders,
    loading,
    search,
    setSearch: setSearchState,
    filterStatus,
    setFilterStatus: setFilterStatusState,
    filterOutlet,
    setFilterOutlet: setFilterOutletState,
    startDate,
    setStartDate: setStartDateState,
    endDate,
    setEndDate: setEndDateState,
    clearFilters,
    pagination,
    handlePageChange: (page: number) =>
      setPagination((prev) => ({ ...prev, page })),
    handleLimitChange: (limit: number) =>
      setPagination((prev) => ({ ...prev, limit, page: 1 })),
    refetch: fetchOrders,
  };
};
