import axiosInstance from "@/utils/axiosInstance";
import {
  CreateLaundryItemInput,
  LaundryItemListQuery,
  LaundryItemListResponse,
  UpdateLaundryItemInput,
  LaundryItem,
} from "../types";

export const laundryItemService = {
  async getAllLaundryItems(
    query?: LaundryItemListQuery,
  ): Promise<LaundryItemListResponse> {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.search) params.append("search", query.search);
    if (query?.category) params.append("category", query.category);

    const response = await axiosInstance.get(
      `/laundry-items?${params.toString()}`,
    );
    return response.data;
  },

  async createLaundryItem(
    data: CreateLaundryItemInput,
  ): Promise<{ data: LaundryItem }> {
    const response = await axiosInstance.post("/laundry-items", data);
    return response.data;
  },

  async updateLaundryItem(
    id: string,
    data: UpdateLaundryItemInput,
  ): Promise<{ data: LaundryItem }> {
    const response = await axiosInstance.put(`/laundry-items/${id}`, data);
    return response.data;
  },

  async deleteLaundryItem(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await axiosInstance.delete(`/laundry-items/${id}`);
    return response.data;
  },
};
