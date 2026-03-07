import axiosInstance from "@/utils/axiosInstance";
import {
  CreateOutletInput,
  UpdateOutletInput,
  OutletListResponse,
  OutletResponse,
  OutletListQuery,
} from "@/features/super-admin/outlet/types";

export interface OutletDropdownOption {
  id: string;
  name: string;
  outletCode: string;
}

export const outletService = {
  async getAllOutlets(query?: OutletListQuery): Promise<OutletListResponse> {
    try {
      const params = new URLSearchParams();

      if (query?.page) params.append("page", query.page.toString());
      if (query?.limit) params.append("limit", query.limit.toString());
      if (query?.search) params.append("search", query.search);

      const response = await axiosInstance.get(`/outlets?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error("Get outlets error:", error);
      throw error;
    }
  },

  async getAllOutletsForDropdown(): Promise<OutletDropdownOption[]> {
    try {
      const response = await axiosInstance.get("/outlets/all");
      return response.data.data;
    } catch (error: any) {
      console.error("Get outlets for dropdown error:", error);
      throw error;
    }
  },

  async getOutletById(id: string): Promise<OutletResponse> {
    try {
      const response = await axiosInstance.get(`/outlets/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Get outlet error:", error);
      throw error;
    }
  },

  async createOutlet(data: CreateOutletInput): Promise<OutletResponse> {
    try {
      const response = await axiosInstance.post("/outlets", data);
      return response.data;
    } catch (error: any) {
      console.error("Create outlet error:", error);
      throw error;
    }
  },

  async updateOutlet(
    id: string,
    data: UpdateOutletInput,
  ): Promise<OutletResponse> {
    try {
      const response = await axiosInstance.put(`/outlets/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error("Update outlet error:", error);
      throw error;
    }
  },

  /**
   * DELETE OUTLET
   * Soft delete outlet
   *
   * Backend akan validasi:
   * - Tidak boleh delete jika masih ada employee aktif
   * - Tidak boleh delete jika masih ada orders aktif
   */
  async deleteOutlet(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.delete(`/outlets/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Delete outlet error:", error);
      throw error;
    }
  },

  /**
   * CALCULATE SHIPPING (Optional - untuk future feature)
   * Menghitung ongkir dari outlet ke customer address
   */
  async calculateShipping(
    outletId: string,
    latitude: number,
    longitude: number,
  ) {
    try {
      const response = await axiosInstance.post(
        `/outlets/${outletId}/calculate-shipping`,
        { latitude, longitude },
      );
      return response.data;
    } catch (error: any) {
      console.error("Calculate shipping error:", error);
      throw error;
    }
  },
};
