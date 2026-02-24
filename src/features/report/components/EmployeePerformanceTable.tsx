"use client";

import { Trophy, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Pagination from "@/components/shared/Pagination";
import { TopPerformer, EmployeePerformanceItem } from "../types/report.types";

// Role badge helpers

const ROLE_LABELS: Record<string, string> = {
  WORKER_WASHING: "Washing",
  WORKER_IRONING: "Ironing",
  WORKER_PACKING: "Packing",
  DRIVER: "Driver",
  OUTLET_ADMIN: "Outlet Admin",
};

const ROLE_COLORS: Record<string, string> = {
  WORKER_WASHING: "bg-cyan-100 text-cyan-700",
  WORKER_IRONING: "bg-orange-100 text-orange-700",
  WORKER_PACKING: "bg-pink-100 text-pink-700",
  DRIVER: "bg-indigo-100 text-indigo-700",
  OUTLET_ADMIN: "bg-blue-100 text-blue-700",
};

function RoleBadge({ role }: { role: string }) {
  return (
    <Badge
      variant="secondary"
      className={`${ROLE_COLORS[role] ?? "bg-slate-100 text-slate-700"} border-none text-xs`}
    >
      {ROLE_LABELS[role] ?? role}
    </Badge>
  );
}

// Top Performer Card
interface TopPerformerCardProps {
  topPerformer: TopPerformer | null;
  totalEmployees: number;
  loading?: boolean;
}

export function TopPerformerCard({
  topPerformer,
  totalEmployees,
  loading,
}: TopPerformerCardProps) {
  if (loading) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="w-12 h-12 bg-slate-200 rounded-full" />
            <div className="h-4 bg-slate-200 rounded w-32" />
            <div className="h-6 bg-slate-200 rounded w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {/* Top Performer */}
      <Card className="border-none shadow-sm bg-linear-to-br from-amber-50 to-orange-50 border border-amber-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Top Performer
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topPerformer ? (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xl font-bold shrink-0">
                {topPerformer.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-lg">
                  {topPerformer.fullName}
                </p>
                <RoleBadge role={topPerformer.role} />
                <p className="text-2xl font-extrabold text-amber-600 mt-1">
                  {topPerformer.totalJobsDone}
                  <span className="text-sm font-medium text-slate-500 ml-1">
                    jobs
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">
              No data for this period.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-500" />
            Period Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-sm text-slate-600">Employees tracked</span>
            <span className="text-lg font-bold text-slate-800">
              {totalEmployees}
            </span>
          </div>
          {topPerformer && (
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-600">Best performance</span>
              <span className="text-lg font-bold text-indigo-600">
                {topPerformer.totalJobsDone} jobs
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Employee Performance Table

interface EmployeePerformanceTableProps {
  data: EmployeePerformanceItem[];
  totalItems: number;
  loading?: boolean;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (limit: number) => void;
}

export function EmployeePerformanceTable({
  data,
  totalItems,
  loading,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: EmployeePerformanceTableProps) {
  if (loading) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="p-8 flex justify-center">
          <div className="animate-pulse space-y-3 w-full">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center text-slate-400 text-sm">
        No employee data for the selected period and filters.
      </div>
    );
  }

  // Hitung rank global berdasarkan posisi di halaman saat ini
  const rankOffset = (currentPage - 1) * itemsPerPage;

  // Info "Showing X - Y of Z"
  const showingFrom = rankOffset + 1;
  const showingTo = Math.min(rankOffset + data.length, totalItems);

  return (
    <div className="space-y-0">
      {/* Items per page selector — di atas tabel, sejajar kanan */}
      <div className="flex items-center justify-between px-1 pb-3">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-medium text-slate-700">{showingFrom}</span>
          {" – "}
          <span className="font-medium text-slate-700">{showingTo}</span>
          {" of "}
          <span className="font-medium text-slate-700">{totalItems}</span>{" "}
          employees
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Show</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(val) => onItemsPerPageChange(Number(val))}
          >
            <SelectTrigger className="w-20 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-slate-500">per page</span>
        </div>
      </div>

      {/* Tabel */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-700 w-10">
                #
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Employee
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Role
              </TableHead>
              <TableHead className="font-semibold text-slate-700 text-center">
                Washing
              </TableHead>
              <TableHead className="font-semibold text-slate-700 text-center">
                Ironing
              </TableHead>
              <TableHead className="font-semibold text-slate-700 text-center">
                Packing
              </TableHead>
              <TableHead className="font-semibold text-slate-700 text-center">
                Pickups
              </TableHead>
              <TableHead className="font-semibold text-slate-700 text-center">
                Deliveries
              </TableHead>
              <TableHead className="font-semibold text-slate-700 text-center">
                Total Jobs
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((emp, index) => {
              // Rank global: halaman 2 dengan 10/halaman → rank mulai dari 11
              const globalRank = rankOffset + index + 1;
              const isTopGlobal = globalRank === 1;

              return (
                <TableRow
                  key={emp.employeeId}
                  className={`hover:bg-slate-50/50 ${isTopGlobal ? "bg-amber-50/50" : ""}`}
                >
                  {/* Rank */}
                  <TableCell className="font-medium text-slate-400">
                    {isTopGlobal ? (
                      <Trophy className="w-4 h-4 text-amber-500" />
                    ) : (
                      globalRank
                    )}
                  </TableCell>

                  {/* Employee */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm shrink-0">
                        {emp.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">
                          {emp.fullName}
                        </p>
                        {emp.outletName && (
                          <p className="text-xs text-slate-400">
                            {emp.outletName}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    <RoleBadge role={emp.role} />
                  </TableCell>

                  {/* Station counts */}
                  <TableCell className="text-center">
                    {emp.washingCompleted > 0 ? (
                      <span className="font-semibold text-cyan-700">
                        {emp.washingCompleted}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {emp.ironingCompleted > 0 ? (
                      <span className="font-semibold text-orange-600">
                        {emp.ironingCompleted}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {emp.packingCompleted > 0 ? (
                      <span className="font-semibold text-pink-600">
                        {emp.packingCompleted}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </TableCell>

                  {/* Driver counts */}
                  <TableCell className="text-center">
                    {emp.totalPickups > 0 ? (
                      <span className="font-semibold text-indigo-600">
                        {emp.totalPickups}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {emp.totalDeliveries > 0 ? (
                      <span className="font-semibold text-indigo-600">
                        {emp.totalDeliveries}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </TableCell>

                  {/* Total */}
                  <TableCell className="text-center">
                    <span
                      className={`font-bold text-base ${
                        isTopGlobal ? "text-amber-600" : "text-slate-700"
                      }`}
                    >
                      {emp.totalJobsDone}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination dari shared component */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            showingFrom={showingFrom}
            showingTo={showingTo}
          />
        )}
      </div>
    </div>
  );
}
