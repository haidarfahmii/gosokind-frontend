"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { outletService } from "@/features/dashboard/outlet/services/outlet.service";
import { toast } from "react-toastify";

interface Outlet {
  id: string;
  name: string;
  province?: string | null;
  city?: string | null;
  status?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

interface OutletFilterContextValue {
  selectedOutletId: string;
  setSelectedOutletId: (id: string) => void;
  outlets: Outlet[];
  loadingOutlets: boolean;
  refreshOutlets: () => Promise<void>;
}

export const OutletFilterContext = createContext<
  OutletFilterContextValue | undefined
>(undefined);

export function OutletFilterProvider({ children }: { children: ReactNode }) {
  const [selectedOutletId, setSelectedOutletId] = useState<string>("all");
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loadingOutlets, setLoadingOutlets] = useState<boolean>(true);

  const fetchOutlets = async () => {
    try {
      setLoadingOutlets(true);
      const response = await outletService.getAllOutlets();

      if (response.success && response.data) {
        setOutlets(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch outlets:", error);
      toast.error("Failed to load outlets");
    } finally {
      setLoadingOutlets(false);
    }
  };

  useEffect(() => {
    fetchOutlets();
  }, []);

  const refreshOutlets = async () => {
    await fetchOutlets();
  };

  const value: OutletFilterContextValue = {
    selectedOutletId,
    setSelectedOutletId,
    outlets,
    loadingOutlets,
    refreshOutlets,
  };

  return (
    <OutletFilterContext.Provider value={value}>
      {children}
    </OutletFilterContext.Provider>
  );
}
