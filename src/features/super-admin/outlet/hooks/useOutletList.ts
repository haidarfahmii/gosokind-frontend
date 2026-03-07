"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { Outlet } from "@/features/super-admin/outlet/types";
import { outletService } from "@/features/super-admin/outlet/services/outlet.service";
import { useDebounce } from "@/hooks/useDebounce";
import { useUrlState } from "@/hooks/useUrlState";

export const useOutletList = () => {
  const urlState = useUrlState();
  const isInitialMount = useRef<boolean>(true);

  const [search, setSearch] = useState(() => urlState.getParam("search", ""));
  const debouncedSearch = useDebounce(search, 500);

  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    page: urlState.getParamAsNumber("page", 1),
    limit: urlState.getParamAsNumber("limit", 10),
    total: 0,
    totalPages: 0,
  });

  const fetchOutlets = useCallback(async () => {
    try {
      setLoading(true);

      const response = await outletService.getAllOutlets({
        page: pagination.page,
        limit: pagination.limit,
        search: search || undefined,
      });

      if (response.success) {
        setOutlets(response.data);
        setPagination((prev) => ({
          ...prev,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
        }));
      }
    } catch (error: any) {
      console.error("Fetch outlets error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch outlets");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch]);

  // Reset ke page 1 saat search berubah
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
    fetchOutlets();

    isInitialMount.current = false;
  }, [fetchOutlets]);

  const deleteOutlet = async (id: string) => {
    const outlet = outlets.find((o) => o.id === id);
    const confirmMessage = outlet
      ? `Are you sure you want to delete "${outlet.name}"?`
      : "Are you sure you want to delete this outlet?";

    if (!confirm(confirmMessage)) return;

    try {
      await outletService.deleteOutlet(id);
      toast.success("Outlet deleted successfully");
      fetchOutlets(); // Refresh list
    } catch (error: any) {
      console.error("Delete outlet error:", error);
      toast.error(error.response?.data?.message || "Failed to delete outlet");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleSearch = (searchQuery: string) => {
    setSearch(searchQuery);
    // Reset page dilakukan via useEffect [debouncedSearch]
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  // Cleanup abort jika diperlukan di masa depan
  useEffect(() => {
    return () => {
      isInitialMount.current = true;
    };
  }, []);

  return {
    outlets,
    loading,
    pagination,
    search,
    refetch: fetchOutlets,
    deleteOutlet,
    handlePageChange,
    handleSearch,
    handleLimitChange,
  };
};
