import { Package } from "lucide-react";

export function OrderTableEmptyState() {
  return (
    <div className="text-center py-12">
      <Package className="mx-auto h-12 w-12 text-slate-300" />
      <h3 className="mt-4 text-lg font-semibold text-slate-900">
        No Orders Found
      </h3>
      <p className="mt-2 text-sm text-slate-500">
        No orders match your current filters.
      </p>
    </div>
  );
}
