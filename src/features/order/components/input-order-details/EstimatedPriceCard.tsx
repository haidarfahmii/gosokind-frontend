interface EstimatedPriceCardProps {
  total: number;
}

/**
 * Card yang menampilkan estimasi total harga order.
 * Komponen ini tidak render apapun jika total <= 0,
 * sehingga parent tidak perlu melakukan pengecekan kondisi.
 */
export function EstimatedPriceCard({ total }: EstimatedPriceCardProps) {
  if (total <= 0) return null;

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-blue-900">
          Estimated Total Price:
        </span>
        <span className="text-lg font-bold text-blue-900">
          Rp {total.toLocaleString("id-ID")}
        </span>
      </div>
      <p className="text-xs text-blue-700 mt-1">
        * Price may vary based on special treatments or discounts
      </p>
    </div>
  );
}
