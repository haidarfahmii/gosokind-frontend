import axiosInstance from "@/utils/axiosInstance";
import { DriverJob, DriverJobDTO } from "@/@types/driver.types";

const JOB_ENDPOINT = "/driver";

// Mapper
const mapDtoToJob = (dto: DriverJobDTO): DriverJob => ({
  id: dto.id,
  orderId: dto.orderNumber,
  type: dto.type,
  status: dto.status,
  customerName: dto.customer?.fullName || "Unknown Customer",
  address: dto.address?.address || "No Address Provided",
  itemCount: dto.orderItems?.reduce((acc, item) => acc + item.quantity, 0) || 0,
  date: new Date(dto.createdAt || new Date()).toLocaleDateString("id-ID"),
});

// API Calls
export const getAvailableJobs = async (
  page: number = 1,
  limit: number = 10,
  sortBy: string = "asc",
  timeFilter: string = "all"
): Promise<{ data: DriverJob[]; meta: any }> => {
  const { data } = await axiosInstance.get<{
    success: boolean;
    data: DriverJobDTO[];
    meta: any;
  }>(`${JOB_ENDPOINT}/available`, {
    params: { page, limit, sortBy, timeFilter },
  });
  return {
    data: data.data.map(mapDtoToJob),
    meta: data.meta,
  };
};

export const getActiveJob = async (): Promise<DriverJob | null> => {
  try {
    const { data } = await axiosInstance.get<{
      success: boolean;
      data: DriverJobDTO | null;
    }>(`${JOB_ENDPOINT}/active`);
    if (!data.data) return null;
    return mapDtoToJob(data.data);
  } catch (error: any) {
    return error.response?.status === 404 ? null : Promise.reject(error);
  }
};

export const acceptJob = async (
  jobId: string,
  type?: string,
): Promise<void> => {
  let jobType = type;
  if (!jobType) {
    const response = await getAvailableJobs(1, 100);
    const target = response.data.find((j) => j.id === jobId);
    if (!target) throw new Error("Job not found");
    jobType = target.type;
  }
  const endpoint =
    jobType === "PICKUP"
      ? `${JOB_ENDPOINT}/pickup/accept`
      : `${JOB_ENDPOINT}/delivery/accept`;
  await axiosInstance.post(endpoint, { orderId: jobId });
};

export const completeJob = async (
  jobId: string,
  type: string,
): Promise<void> => {
  const endpoint =
    type === "PICKUP"
      ? `${JOB_ENDPOINT}/pickup/complete`
      : `${JOB_ENDPOINT}/delivery/complete`;
  await axiosInstance.post(endpoint, { orderId: jobId });
};

export const getDriverHistory = async (
  page: number = 1,
  limit: number = 10,
  sortBy: string = "desc",
  timeFilter: string = "all"
): Promise<{ data: DriverJob[]; meta: any }> => {
  const { data } = await axiosInstance.get<{ data: DriverJobDTO[]; meta: any }>(
    `${JOB_ENDPOINT}/history`,
    { params: { page, limit, sortBy, timeFilter } }
  );
  return { 
    data: data.data.map(mapDtoToJob),
    meta: data.meta
  };
};
