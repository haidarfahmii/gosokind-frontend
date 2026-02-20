"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BypassRequest, Order } from "@/features/order/types/order.types";
import { useOrderList, useBypassRequests } from "@/features/order/hooks";

export function useOrderPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  // Dialog state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false);
  const [isInputDialogOpen, setIsInputDialogOpen] = useState<boolean>(false);
  const [isBypassDialogOpen, setIsBypassDialogOpen] = useState<boolean>(false);

  const [selectedBypassRequests, setSelectedBypassRequests] = useState<
    BypassRequest[]
  >([]);

  // Outlets for Super Admin filter
  const [outlets, setOutlets] = useState<Array<{ id: string; name: string }>>(
    [],
  );
  const [loadingOutlets, setLoadingOutlets] = useState<boolean>(false);

  // Hooks
  const {
    orders,
    loading,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterOutlet,
    setFilterOutlet,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clearFilters,
    pagination,
    handlePageChange,
    handleLimitChange,
    refetch: refetchOrders,
  } = useOrderList();

  const {
    bypassRequests,
    loading: loadingBypass,
    pagination: bypassPagination,
    handlePageChange: handleBypassPageChange,
    handleBypassRequest,
  } = useBypassRequests(filterOutlet !== "all" ? filterOutlet : undefined);

  // Fetch outlets (Super Admin only)
  useEffect(() => {
    if (!isSuperAdmin) return;

    const fetchOutlets = async () => {
      try {
        setLoadingOutlets(true);
        const response = await fetch("/api/outlets?limit=100");
        const data = await response.json();
        if (data.success) {
          setOutlets(
            data.data.map((outlet: any) => ({
              id: outlet.id,
              name: outlet.name,
            })),
          );
        }
      } catch (error) {
        console.error("Failed to fetch outlets:", error);
      } finally {
        setLoadingOutlets(false);
      }
    };

    fetchOutlets();
  }, [isSuperAdmin]);

  // Order handlers
  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const handleInputDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsInputDialogOpen(true);
  };

  const handleInputSuccess = () => {
    refetchOrders();
    setIsInputDialogOpen(false);
  };

  // Bypass handlers
  const handleViewBypassRequests = () => {
    setSelectedBypassRequests(bypassRequests);
    setIsBypassDialogOpen(true);
  };

  const handleViewOrderBypass = (order: Order, requests: BypassRequest[]) => {
    setSelectedOrder(order);
    setSelectedBypassRequests(requests); // hanya bypass milik order ini
    setIsBypassDialogOpen(true);
  };

  const handleBypassAction = async (
    action: "APPROVED" | "REJECTED",
    id: string,
    note?: string,
  ) => {
    await handleBypassRequest(id, action, note);
    refetchOrders();
    setSelectedBypassRequests((prev) => prev.filter((br) => br.id !== id));
  };

  // Derived state
  const activeOutletName =
    outlets.find((o) => o.id === filterOutlet)?.name ?? "Selected Outlet";

  const showInitialLoader =
    (loading && orders.length === 0 && !search && filterStatus === "all") ||
    loadingOutlets;

  return {
    // Session
    isSuperAdmin,

    // Orders
    orders,
    loading,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterOutlet,
    setFilterOutlet,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clearFilters,
    pagination,
    handlePageChange,
    handleLimitChange,

    // Outlets
    outlets,
    activeOutletName,

    // Bypass
    bypassRequests,
    selectedBypassRequests,
    loadingBypass,
    bypassPagination,
    handleBypassPageChange,

    // Dialog state
    selectedOrder,
    isDetailDialogOpen,
    setIsDetailDialogOpen,
    isInputDialogOpen,
    setIsInputDialogOpen,
    isBypassDialogOpen,
    setIsBypassDialogOpen,

    // Handlers
    handleViewDetail,
    handleInputDetails,
    handleInputSuccess,
    handleViewBypassRequests,
    handleViewOrderBypass,
    handleBypassAction,

    // Loader
    showInitialLoader,
  };
}
