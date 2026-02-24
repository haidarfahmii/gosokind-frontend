"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useSalesReport } from "./useSalesReport";
import { useEmployeePerformance } from "./useEmployeePerformance";
import { outletService } from "@/features/super-admin/outlet/services/outlet.service";

export type ReportTab = "sales" | "employees";

export function useReportPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  const [activeTab, setActiveTabState] = useState<ReportTab>("sales");
  const [outlets, setOutlets] = useState<Array<{ id: string; name: string }>>(
    [],
  );
  const [loadingOutlets, setLoadingOutlets] = useState<boolean>(false);

  // Shared outlet filter state (Super Admin only)
  const [globalOutletId, setGlobalOutletId] = useState("all");

  const salesReport = useSalesReport(globalOutletId);
  const employeeReport = useEmployeePerformance(globalOutletId);

  const setActiveTab = useCallback(
    (tab: ReportTab) => {
      setActiveTabState(tab);
      if (tab === "sales") {
        salesReport.setOutletId(globalOutletId);
      } else {
        employeeReport.setOutletId(globalOutletId);
      }
    },
    [globalOutletId, salesReport, employeeReport],
  );

  // Sync global outlet filter into both report hooks
  const handleOutletChange = useCallback(
    (id: string) => {
      setGlobalOutletId(id);
      if (activeTab === "sales") {
        salesReport.setOutletId(id);
      } else {
        employeeReport.setOutletId(id);
      }
    },
    [activeTab, salesReport, employeeReport],
  );

  // Fetch outlets list for Super Admin outlet selector
  useEffect(() => {
    if (!isSuperAdmin) return;

    const fetchOutlets = async () => {
      try {
        setLoadingOutlets(true);
        const response = await outletService.getAllOutlets({ limit: 100 });
        if (response.success) {
          setOutlets(response.data.map((o) => ({ id: o.id, name: o.name })));
        }
      } catch {
        // silently fail — outlets selector is optional enhancement
      } finally {
        setLoadingOutlets(false);
      }
    };

    fetchOutlets();
  }, [isSuperAdmin]);

  const activeOutletName =
    globalOutletId === "all"
      ? "All Outlets"
      : (outlets.find((o) => o.id === globalOutletId)?.name ??
        "Selected Outlet");

  return {
    isSuperAdmin,
    activeTab,
    setActiveTab,
    // Outlet filter (Super Admin)
    outlets,
    loadingOutlets,
    globalOutletId,
    handleOutletChange,
    activeOutletName,
    // Sales report
    salesReport,
    // Employee report
    employeeReport,
  };
}
