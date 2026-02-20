"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/shared/Pagination";
import { BypassRequest, Order } from "../../types/order.types";
import { useExpandedRows } from "../../hooks/useExpandedRows";
import { OrderTableLoadingState, OrderTableEmptyState, OrderTableRow } from ".";

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
  bypassRequests?: BypassRequest[];
  onViewOrderBypass?: (order: Order, requests: BypassRequest[]) => void;
}

export function OrderTable({
  data,
  isLoading,
  onViewDetail,
  onInputDetails,
  pagination,
  onPageChange,
  canInputDetails = true,
  bypassRequests = [],
  onViewOrderBypass = () => {},
}: OrderTableProps) {
  const { isExpanded, toggleRow } = useExpandedRows();

  if (isLoading) return <OrderTableLoadingState />;
  if (data.length === 0) return <OrderTableEmptyState />;

  const getBypassRequestsForOrder = (orderId: string): BypassRequest[] =>
    bypassRequests.filter((br) => br.order.id === orderId);

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
                orderBypassRequests={getBypassRequestsForOrder(order.id)}
                onViewOrderBypass={onViewOrderBypass}
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
