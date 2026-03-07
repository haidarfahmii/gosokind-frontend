import axiosInstance from "@/utils/axiosInstance";
import type {
  CustomerListQuery,
  CustomerListResponse,
} from "@/features/super-admin/customer/types/customer.types";

export const customerService = {
  async getAllCustomers(
    query?: CustomerListQuery,
  ): Promise<CustomerListResponse> {
    const params = new URLSearchParams();

    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.search) params.append("search", query.search);

    const response = await axiosInstance.get(
      `/employees/customers?${params.toString()}`,
    );
    return response.data;
  },
};
