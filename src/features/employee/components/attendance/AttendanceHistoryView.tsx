"use client";

import * as React from "react";
import { useAttendanceHistory } from "@/features/employee/hooks/useAttendanceHistory";
import { format, parseISO } from "date-fns";
import { Loader2, History, RotateCcw } from "lucide-react";
import { Attendance } from "@/@types/worker.types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AttendanceHistoryView() {
  const [page, setPage] = React.useState(1);
  const [date, setDate] = React.useState<Date | undefined>();

  // Use the date formatted as YYYY-MM-DD for the API query
  const formattedDateString = date ? format(date, "yyyy-MM-dd") : undefined;

  const { data, isLoading, isError } = useAttendanceHistory(
    page,
    10,
    formattedDateString
  );

  const historyRecords = data?.data || [];
  const meta = data?.meta;

  const handleClearDate = () => {
    setDate(undefined);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 border-b">
        <h2 className="text-xl font-bold tracking-tight">Attendance History</h2>

        <div className="flex items-center gap-2">
          {date && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearDate}
              className="text-gray-500 hover:text-gray-900 px-2"
              title="Clear date filter"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-[212px] justify-between text-left font-normal ${
                  !date ? "text-muted-foreground" : ""
                }`}
              >
                {date ? format(date, "PPP") : <span>Filter by date</span>}
                <ChevronDownIcon className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate: Date | undefined) => {
                  setDate(selectedDate);
                  setPage(1); // Reset page on filter change
                }}
                defaultMonth={date}
                disabled={(d: Date) => d > new Date()} // Prevent future dates
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-center justify-center">
          Failed to load attendance history. Please try again.
        </div>
      ) : historyRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
          <History className="w-12 h-12 mb-3 text-gray-300" />
          <p className="text-lg font-medium text-gray-900">No records found</p>
          <p className="text-sm">
            {date
              ? `No attendance records for ${format(date, "PPP")}.`
              : "You have no attendance history yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Clock In</th>
                  <th className="px-4 py-3">Clock Out</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historyRecords.map((record: Attendance) => {
                  const recordDate = parseISO(record.date.toString());
                  const clockIn = parseISO(record.clockIn.toString());
                  const clockOut = record.clockOut
                    ? parseISO(record.clockOut.toString())
                    : null;

                  let duration = "-";
                  if (clockOut) {
                    const diffMs = clockOut.getTime() - clockIn.getTime();
                    const hours = Math.floor(diffMs / (1000 * 60 * 60));
                    const mins = Math.floor(
                      (diffMs % (1000 * 60 * 60)) / (1000 * 60)
                    );
                    duration = `${hours}h ${mins}m`;
                  }

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {format(recordDate, "MMM dd, yyyy")}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {format(clockIn, "HH:mm")}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {clockOut ? format(clockOut, "HH:mm") : "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{duration}</td>
                      <td className="px-4 py-3 text-right">
                        {!record.clockOut ? (
                          <Badge
                            variant="default"
                            className="bg-green-100 text-green-700 hover:bg-green-200"
                          >
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            Completed
                          </Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.lastPage > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
              <span className="text-sm text-gray-500">
                Page {meta.page} of {meta.lastPage}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={meta.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
                  disabled={meta.page >= meta.lastPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
