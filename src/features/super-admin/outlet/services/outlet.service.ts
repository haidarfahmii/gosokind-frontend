import axiosInstance from "@/utils/axiosInstance";
import {
  CreateOutletInput,
  UpdateOutletInput,
  OutletListResponse,
  OutletResponse,
  OutletWithGeocodingResponse,
  CheckLocationInput,
  CheckLocationResponse,
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

  /**
   * CHECK LOCATION (Preview Geocoding)
   * ENDPOINT BARU untuk preview hasil geocoding SEBELUM save
   *
   * Use case:
   * - Admin input alamat di form
   * - Frontend hit endpoint ini untuk preview koordinat
   * - Admin review apakah lokasi sudah benar di map
   * - Baru kemudian save via createOutlet
   */
  async checkLocation(
    data: CheckLocationInput,
  ): Promise<CheckLocationResponse> {
    try {
      const response = await axiosInstance.post(
        "/outlets/check-location",
        data,
      );
      return response.data;
    } catch (error: any) {
      console.error("Check location error:", error);
      throw error;
    }
  },

  async createOutlet(
    data: CreateOutletInput,
  ): Promise<OutletWithGeocodingResponse> {
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
    customerAddressId: string,
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      outletId: string;
      outletName: string;
      customerAddressId: string;
      distance: number;
      shippingPrice: number;
      estimatedTime: number;
    };
  }> {
    try {
      const response = await axiosInstance.post(
        `/outlets/${outletId}/calculate-shipping`,
        { customerAddressId },
      );
      return response.data;
    } catch (error: any) {
      console.error("Calculate shipping error:", error);
      throw error;
    }
  },
};
