"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/shared/Pagination";
import { Order } from "../types/order.types";
import { useExpandedRows } from "../hooks/useExpandedRows";
import {
  OrderTableLoadingState,
  OrderTableEmptyState,
  OrderTableRow,
} from "./order-table";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface OrderTableProps {
  data: Order[];
  isLoading: boolean;
  onViewDetail: (order: Order) => void;
  onInputDetails: (order: Order) => void;
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  /** Permission untuk input details — khusus Outlet Admin */
  canInputDetails?: boolean;
}

export function OrderTable({
  data,
  isLoading,
  onViewDetail,
  onInputDetails,
  pagination,
  onPageChange,
  canInputDetails = true,
}: OrderTableProps) {
  const { isExpanded, toggleRow } = useExpandedRows();

  if (isLoading) return <OrderTableLoadingState />;
  if (data.length === 0) return <OrderTableEmptyState />;

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold">Order Number</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Outlet</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Weight</TableHead>
              <TableHead className="font-semibold">Price</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((order) => (
              <OrderTableRow
                key={order.id}
                order={order}
                isExpanded={isExpanded(order.id)}
                onToggleExpand={toggleRow}
                onViewDetail={onViewDetail}
                onInputDetails={onInputDetails}
                canInputDetails={canInputDetails}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-end">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
