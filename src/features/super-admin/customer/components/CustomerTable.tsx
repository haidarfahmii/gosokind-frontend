"use client";

import { BadgeCheck, MapPin, ShieldOff, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/shared/Pagination";
import { formatDate } from "@/utils/formatters";
import type {
  Customer,
  PaginationData,
} from "@/features/super-admin/customer/types/customer.types";

interface CustomerTableProps {
  data: Customer[];
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

function ProviderBadge({ provider }: { provider?: string | null }) {
  if (!provider || provider === "credentials") return null;

  const label = provider.charAt(0).toUpperCase() + provider.slice(1);
  return (
    <Badge
      variant="outline"
      className="text-xs capitalize text-blue-600 border-blue-200 bg-blue-50"
    >
      {label}
    </Badge>
  );
}

export function CustomerTable({
  data,
  pagination,
  onPageChange,
}: CustomerTableProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
        <User className="h-10 w-10" />
        <p className="text-sm font-medium">No customers found</p>
        <p className="text-xs">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-slate-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-3 font-semibold text-slate-600 w-12">
                #
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">
                Customer
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">
                Status
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">
                Primary Address
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden xl:table-cell">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((customer, index) => {
              const rowNumber =
                (pagination.page - 1) * pagination.limit + index + 1;
              const primaryAddress = customer.addresses?.[0];

              return (
                <tr
                  key={customer.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* Row number */}
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {rowNumber}
                  </td>

                  {/* Customer info */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={customer.avatarUrl ?? undefined} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-semibold">
                          {customer.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-slate-800 truncate">
                            {customer.fullName}
                          </p>
                          <ProviderBadge provider={customer.provider} />
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Verified status */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    {customer.isVerified ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                        <ShieldOff className="h-3.5 w-3.5" />
                        Unverified
                      </span>
                    )}
                  </td>

                  {/* Primary address */}
                  <td className="px-4 py-3 hidden lg:table-cell max-w-55">
                    {primaryAddress ? (
                      <div className="flex items-start gap-1.5 text-xs text-slate-600">
                        <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-400" />
                        <span
                          className="truncate"
                          title={primaryAddress.address}
                        >
                          <span className="font-medium text-slate-700">
                            {primaryAddress.label}:{" "}
                          </span>
                          {primaryAddress.address}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        No address yet
                      </span>
                    )}
                  </td>

                  {/* Joined date */}
                  <td className="px-4 py-3 hidden xl:table-cell text-xs text-slate-500">
                    {formatDate(customer.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
        totalItems={pagination.total}
        itemsPerPage={pagination.limit}
      />
    </div>
  );
}
