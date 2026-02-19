"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

export interface LaundryItem {
  id: string;
  name: string;
  category?: string;
  basePrice?: number;
}

/**
 * Hook untuk fetch daftar laundry items dari API.
 * Dipisah dari useInputOrderDetailsForm agar bisa dipakai ulang
 * di komponen lain yang membutuhkan data yang sama.
 */
export function useLaundryItems(open: boolean) {
  const [laundryItems, setLaundryItems] = useState<LaundryItem[]>([]);
  const [loadingItems, setLoadingItems] = useState<boolean>(false);

  useEffect(() => {
    if (!open) return;

    const fetchLaundryItems = async () => {
      try {
        setLoadingItems(true);
        const response = await axiosInstance.get("/laundry-items", {
          params: { limit: 100 },
        });
        setLaundryItems(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch laundry items:", error);
        toast.error("Failed to load laundry items");
      } finally {
        setLoadingItems(false);
      }
    };

    fetchLaundryItems();
  }, [open]);

  return { laundryItems, loadingItems };
}
