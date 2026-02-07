"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Pencil,
  Trash2,
  MapPin,
  Users,
  ShoppingBag,
  Store,
} from "lucide-react";
import { Outlet } from "../types";
import Pagination from "@/components/shared/Pagination";

interface OutletTableProps {
  data: Outlet[];
  onEdit: (outlet: Outlet) => void;
  onDelete: (id: string) => void;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  loading?: boolean;
}

export function OutletTable({
  data,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
  loading,
}: OutletTableProps) {
  const showingFrom = pagination
    ? (pagination.page - 1) * pagination.limit + 1
    : 0;
  const showingTo = pagination
    ? Math.min(pagination.page * pagination.limit, pagination.total)
    : 0;

  if (loading) {
    return (
      <div className="border rounded-lg p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading outlets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 border-b">
            <TableRow>
              <TableHead className="font-semibold text-slate-700 w-62.5">
                Outlet
              </TableHead>
              <TableHead className="font-semibold text-slate-700 text-center">
                Status
              </TableHead>
              <TableHead className="font-semibold text-slate-700">
                Location
              </TableHead>
              <TableHead className="font-semibold text-slate-700 text-center">
                Coordinates
              </TableHead>
              <TableHead className="font-semibold text-slate-700 text-center">
                Stats
              </TableHead>
              <TableHead className="text-right font-semibold text-slate-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-slate-500"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Store className="h-12 w-12 text-slate-300" />
                    <p className="font-medium">No outlets found</p>
                    <p className="text-sm text-slate-400">
                      Create your first outlet to get started
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((outlet) => (
                <TableRow key={outlet.id} className="hover:bg-slate-50/50">
                  {/* Outlet Name */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                        <Store className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">
                          {outlet.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          ID: {outlet.id.substring(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        outlet.status === "AVAILABLE" ? "default" : "secondary"
                      }
                      className={
                        outlet.status === "AVAILABLE"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      }
                    >
                      {outlet.status === "AVAILABLE" ? (
                        <>
                          <span className="mr-1"></span> Available
                        </>
                      ) : (
                        <>
                          <span className="mr-1"></span> Maintenance
                        </>
                      )}
                    </Badge>
                  </TableCell>

                  {/* Location */}
                  <TableCell>
                    <div className="flex items-start gap-2 max-w-xs">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                      <div className="text-sm text-slate-600">
                        {outlet.province && outlet.city && (
                          <p className="text-xs text-slate-500 font-medium">
                            {outlet.city}, {outlet.province}
                          </p>
                        )}
                        <span className="line-clamp-2">{outlet.address}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Coordinates */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant="outline"
                        className="text-[10px] font-mono w-fit justify-center"
                      >
                        {outlet.latitude.toFixed(4)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-mono w-fit justify-center"
                      >
                        {outlet.longitude.toFixed(4)}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Stats (Employees & Orders Count) */}
                  <TableCell>
                    {outlet._count ? (
                      <div className="flex flex-col gap-1 items-center">
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Users className="w-3 h-3" />
                          <span>Employee:{outlet._count.employees}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <ShoppingBag className="w-3 h-3" />
                          <span>Order:{outlet._count.orders}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem onClick={() => onEdit(outlet)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit Details
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => onDelete(outlet.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Outlet
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Component */}
      {pagination && onPageChange && pagination.totalPages > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          showingFrom={showingFrom}
          showingTo={showingTo}
        />
      )}
    </div>
  );
}
