"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  SalesReportQuery,
  SalesReportResponse,
  ReportPeriod,
} from "@/features/report/types/report.types";
import { reportService } from "@/features/report/services/report.service";

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

const INITIAL_PERIOD: ReportPeriod = "daily";

const getDatesForPeriod = (period: ReportPeriod) => {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  if (period === "daily") {
    return { startDate: todayStr, endDate: todayStr };
  }

  if (period === "monthly") {
    const start = new Date(today);
    start.setDate(start.getDate() - 30);
    return { startDate: start.toISOString().split("T")[0], endDate: todayStr };
  }

  // yearly
  const start = new Date(today);
  start.setFullYear(start.getFullYear() - 1);
  return { startDate: start.toISOString().split("T")[0], endDate: todayStr };
};

export function useSalesReport(
  initialOutletId: string = "all",
): UseSalesReportReturn {
  const initialDates = getDatesForPeriod(INITIAL_PERIOD);

  const [report, setReport] = useState<SalesReportResponse["data"] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [period, setPeriod] = useState<ReportPeriod>(INITIAL_PERIOD);
  const [startDate, setStartDate] = useState(initialDates.startDate);
  const [endDate, setEndDate] = useState(initialDates.endDate);
  const [outletId, setOutletId] = useState(initialOutletId);

  const handlePeriodChange = useCallback((newPeriod: ReportPeriod) => {
    const { startDate: newStart, endDate: newEnd } =
      getDatesForPeriod(newPeriod);
    setPeriod(newPeriod);
    setStartDate(newStart);
    setEndDate(newEnd);
  }, []);

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
    setPeriod: handlePeriodChange,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    outletId,
    setOutletId,
    refetch: fetchReport,
  };
}
