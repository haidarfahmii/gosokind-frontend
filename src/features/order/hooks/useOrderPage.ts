"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BypassRequest, Order } from "@/features/order/types/order.types";
import { useOrderList, useBypassRequests } from "@/features/order/hooks";
import { useOutletFilter } from "@/hooks/useOutletFilter";

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

  const { selectedOutletId, setSelectedOutletId, outlets, loadingOutlets } =
    useOutletFilter();

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
    clearFilters: clearLocalFilters,
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

  useEffect(() => {
    setFilterOutlet(selectedOutletId);
  }, [selectedOutletId, setFilterOutlet]);

  // Clear all filters — termasuk reset global outlet di header
  const clearFilters = () => {
    clearLocalFilters();
    if (isSuperAdmin) {
      setSelectedOutletId("all");
    }
  };

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
    loadingOutlets,

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
