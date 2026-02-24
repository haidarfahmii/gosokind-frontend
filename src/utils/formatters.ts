export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatAxisCurrency = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    // Hilangkan desimal jika angka bulat, misal: "Rp 2M" bukan "Rp 2.0M"
    const inMillions = value / 1_000_000;
    return `Rp ${inMillions % 1 === 0 ? inMillions.toFixed(0) : inMillions.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const inThousands = value / 1_000;
    return `Rp ${inThousands % 1 === 0 ? inThousands.toFixed(0) : inThousands.toFixed(1)}K`;
  }
  return `Rp ${value}`;
};
