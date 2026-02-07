"use client";

import { useContext } from "react";
import { OutletFilterContext } from "@/contexts/OutletFilterContext";

export function useOutletFilter() {
  const context = useContext(OutletFilterContext);

  if (context === undefined) {
    throw new Error(
      "useOutletFilter must be used within an OutletFilterProvider",
    );
  }

  return context;
}
