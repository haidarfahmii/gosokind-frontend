"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { LaundryItem, LaundryItemListQuery } from "../types";
import { laundryItemService } from "../services/laundry-item.service";
import { useDebounce } from "@/hooks/useDebounce";
import { useUrlState } from "@/hooks/useUrlState";

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useLaundryItemList() {
  const urlState = useUrlState();
  const isInitialMount = useRef<boolean>(true);

  const [items, setItems] = useState<LaundryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [search, setSearch] = useState(() => urlState.getParam("search", ""));
  const [filterCategory, setFilterCategory] = useState(() =>
    urlState.getParam("category", "all"),
  );

  const debouncedSearch = useDebounce(search, 500);

  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: urlState.getParamAsNumber("page", 1),
    limit: urlState.getParamAsNumber("limit", 5),
    totalPages: 0,
  });

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);

      const query: LaundryItemListQuery = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (debouncedSearch) query.search = debouncedSearch;
      if (filterCategory !== "all") query.category = filterCategory;

      const res = await laundryItemService.getAllLaundryItems(query);

      setItems(res.data ?? []);
      setPagination((prev) => ({
        ...prev,
        total: res.pagination?.total ?? 0,
        totalPages: res.pagination?.totalPages ?? 0,
      }));
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Gagal memuat data item");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, filterCategory]);

  // Reset ke page 1 saat filter berubah
  useEffect(() => {
    if (isInitialMount.current) return;
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch, filterCategory]);

  // Sinkronisasi URL & trigger fetch
  useEffect(() => {
    const urlParams: Record<string, string | null> = {
      search: debouncedSearch || null,
      category: filterCategory !== "all" ? filterCategory : null,
      page: pagination.page !== 1 ? String(pagination.page) : null,
      limit: pagination.limit !== 5 ? String(pagination.limit) : null,
    };

    urlState.setParams(urlParams);
    fetchItems();

    isInitialMount.current = false;
  }, [fetchItems]);

  const clearFilters = () => {
    setSearch("");
    setFilterCategory("all");
    setPagination((prev) => ({ ...prev, page: 1, limit: 5 }));
  };

  return {
    items,
    loading,
    search,
    setSearch,
    filterCategory,
    setFilterCategory,
    clearFilters,
    pagination,
    handlePageChange: (page: number) =>
      setPagination((prev) => ({ ...prev, page })),
    handleLimitChange: (limit: number) =>
      setPagination((prev) => ({ ...prev, limit, page: 1 })),
    refetch: fetchItems,
  };
}
