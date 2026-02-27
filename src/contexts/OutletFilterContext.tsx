"use client";

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  outletService,
  OutletDropdownOption,
} from "@/features/super-admin/outlet/services/outlet.service";

interface OutletFilterContextValue {
  selectedOutletId: string;
  setSelectedOutletId: (id: string) => void;
  outlets: OutletDropdownOption[];
  loadingOutlets: boolean;
}

export const OutletFilterContext = createContext<
  OutletFilterContextValue | undefined
>(undefined);

interface OutletFilterProviderProps {
  children: ReactNode;
}

export function OutletFilterProvider({ children }: OutletFilterProviderProps) {
  const [selectedOutletId, setSelectedOutletId] = useState<string>("all");
  const [outlets, setOutlets] = useState<OutletDropdownOption[]>([]);
  const [loadingOutlets, setLoadingOutlets] = useState<boolean>(true);

  const fetchOutlets = useCallback(async () => {
    try {
      setLoadingOutlets(true);
      const data = await outletService.getAllOutletsForDropdown();
      setOutlets(data);
    } catch (error) {
      console.error("Failed to fetch outlets for filter:", error);
      setOutlets([]);
    } finally {
      setLoadingOutlets(false);
    }
  }, []);

  useEffect(() => {
    fetchOutlets();
  }, [fetchOutlets]);

  return (
    <OutletFilterContext.Provider
      value={{
        selectedOutletId,
        setSelectedOutletId,
        outlets,
        loadingOutlets,
      }}
    >
      {children}
    </OutletFilterContext.Provider>
  );
}
