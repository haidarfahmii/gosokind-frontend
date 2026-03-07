"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  EmployeePerformanceQuery,
  EmployeePerformanceResponse,
} from "../types/report.types";
import { reportService } from "../services/report.service";

interface UseEmployeePerformanceReturn {
  report: EmployeePerformanceResponse["data"] | null;
  loading: boolean;
  error: string | null;
  // Filters
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  outletId: string;
  setOutletId: (id: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  // Pagination
  page: number;
  setPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (limit: number) => void;
  totalPages: number;
  paginatedData: EmployeePerformanceResponse["data"]["data"];
  // Actions
  refetch: () => void;
}

const getDefaultDates = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    startDate: firstDay.toISOString().split("T")[0],
    endDate: now.toISOString().split("T")[0],
  };
};

export function useEmployeePerformance(
  initialOutletId: string = "all",
): UseEmployeePerformanceReturn {
  const defaults = getDefaultDates();

  const [report, setReport] = useState<
    EmployeePerformanceResponse["data"] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState(defaults.startDate);
  const [endDate, setEndDate] = useState(defaults.endDate);
  const [outletId, setOutletId] = useState(initialOutletId);
  const [roleFilter, setRoleFilter] = useState("all");

  const [page, setPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Reset ke halaman 1 setiap kali filter berubah agar tidak stuck di halaman
  // yang melebihi total halaman baru
  useEffect(() => {
    setPage(1);
  }, [startDate, endDate, outletId, roleFilter]);

  // Reset ke halaman 1 juga saat items per page berubah
  const handleSetItemsPerPage = useCallback((limit: number) => {
    setItemsPerPage(limit);
    setPage(1);
  }, []);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const query: EmployeePerformanceQuery = {
        startDate,
        endDate,
        outletId,
        role: roleFilter,
      };

      const response = await reportService.getEmployeePerformance(query);

      if (response.success) {
        setReport(response.data);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Failed to load employee performance report";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, outletId, roleFilter]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // Hitung pagination client-side dari data yang sudah ada
  const allData = report?.data ?? [];

  // Sort by totalJobsDone desc sebelum dipaginasi
  // (konsisten dengan sorting di EmployeePerformanceTable)
  const sortedData = [...allData].sort(
    (a, b) => b.totalJobsDone - a.totalJobsDone,
  );

  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));

  const paginatedData = sortedData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return {
    report,
    loading,
    error,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    outletId,
    setOutletId,
    roleFilter,
    setRoleFilter,
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage: handleSetItemsPerPage,
    totalPages,
    paginatedData,
    refetch: fetchReport,
  };
}
