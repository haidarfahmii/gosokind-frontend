import axiosInstance from "@/utils/axiosInstance";
import {
  AttendanceDTO,
  DashboardDTO,
  TodayStatus,
  AttendanceRecord,
} from "@/@types/attendance.types";
import { formatDate, formatTime } from "@/utils/formatters";

const ATTENDANCE_ENDPOINT = "/attendance";

// Helpers
const mapToTodayStatus = (dto: DashboardDTO): TodayStatus => ({
  clockInTime: formatTime(dto.todayAttendance?.clockIn),
  clockOutTime: formatTime(dto.todayAttendance?.clockOut),
  duration: dto.shiftDuration || "--",
  daysWorked: dto.daysWorked,
  isClockedIn: !!dto.todayAttendance && !dto.todayAttendance.clockOut,
});

const mapToRecord = (dto: AttendanceDTO): AttendanceRecord => ({
  id: dto.id,
  date: formatDate(dto.date),
  clockIn: formatTime(dto.clockIn) || "--:--",
  clockOut: formatTime(dto.clockOut) || "--:--",
  status: dto.clockOut ? "COMPLETED" : "PRESENT",
});

// API Calls
export const clockIn = async (
  latitude: number,
  longitude: number,
): Promise<void> => {
  await axiosInstance.post(`${ATTENDANCE_ENDPOINT}/clock-in`, {
    latitude,
    longitude,
  });
};

export const clockOut = async (): Promise<void> => {
  await axiosInstance.post(`${ATTENDANCE_ENDPOINT}/clock-out`);
};

export const getDashboard = async (): Promise<TodayStatus> => {
  const { data } = await axiosInstance.get<{ data: DashboardDTO }>(
    `${ATTENDANCE_ENDPOINT}/dashboard`,
  );
  return mapToTodayStatus(data.data);
};

export const getHistory = async (): Promise<AttendanceRecord[]> => {
  const { data } = await axiosInstance.get<{ data: AttendanceDTO[] }>(
    ATTENDANCE_ENDPOINT,
  );
  return data.data.map(mapToRecord);
};
