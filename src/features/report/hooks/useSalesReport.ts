"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  SalesReportQuery,
  SalesReportResponse,
  ReportPeriod,
} from "../types/report.types";
import { reportService } from "../services/report.service";

interface UseSalesReportReturn {
  report: SalesReportResponse["data"] | null;
  loading: boolean;
  error: string | null;
  // Filters
  period: ReportPeriod;
  setPeriod: (period: ReportPeriod) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  outletId: string;
  setOutletId: (id: string) => void;
  // Actions
  refetch: () => void;
}

// Default dates: 1st of current month → today
const getDefaultDates = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const startDate = firstDay.toISOString().split("T")[0];
  const endDate = now.toISOString().split("T")[0];
  return { startDate, endDate };
};

export function useSalesReport(
  initialOutletId: string = "all",
): UseSalesReportReturn {
  const defaults = getDefaultDates();

  const [report, setReport] = useState<SalesReportResponse["data"] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [period, setPeriod] = useState<ReportPeriod>("daily");
  const [startDate, setStartDate] = useState(defaults.startDate);
  const [endDate, setEndDate] = useState(defaults.endDate);
  const [outletId, setOutletId] = useState(initialOutletId);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const query: SalesReportQuery = {
        period,
        startDate,
        endDate,
        outletId,
      };

      const response = await reportService.getSalesReport(query);

      if (response.success) {
        setReport(response.data);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to load sales report";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [period, startDate, endDate, outletId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return {
    report,
    loading,
    error,
    period,
    setPeriod,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    outletId,
    setOutletId,
    refetch: fetchReport,
  };
}
