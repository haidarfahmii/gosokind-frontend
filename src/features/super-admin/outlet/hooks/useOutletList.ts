"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Outlet } from "../types";
import { outletService } from "../services/outlet.service";

export const useOutletList = () => {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState<string>("");

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
        setPagination(response.pagination);
      }
    } catch (error: any) {
      console.error("Fetch outlets error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch outlets");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search]);

  useEffect(() => {
    fetchOutlets();
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
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

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
