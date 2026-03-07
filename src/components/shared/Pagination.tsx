import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  showingFrom?: number;
  showingTo?: number;
  maxPageButtons?: number;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  showingFrom,
  showingTo,
  maxPageButtons = 5,
  className = "",
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= maxPageButtons) {
      // Show all pages if total is less than max
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const halfMax = Math.floor(maxPageButtons / 2);

    // Always show first page
    pages.push(1);

    let startPage = Math.max(2, currentPage - halfMax);
    let endPage = Math.min(totalPages - 1, currentPage + halfMax);

    // Adjust if we're near the start
    if (currentPage <= halfMax + 1) {
      endPage = maxPageButtons - 1;
    }

    // Adjust if we're near the end
    if (currentPage >= totalPages - halfMax) {
      startPage = totalPages - maxPageButtons + 2;
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push("...");
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Calculate showing info
  const from = showingFrom ?? (currentPage - 1) * (itemsPerPage ?? 0) + 1;
  const to =
    showingTo ?? Math.min(currentPage * (itemsPerPage ?? 0), totalItems ?? 0);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    // Show info only if single page and has items
    if (totalItems && totalItems > 0) {
      return (
        <div
          className={`flex items-center justify-between px-4 py-3 sm:px-6 ${className}`}
        >
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{from}</span> to{" "}
            <span className="font-medium">{to}</span> of{" "}
            <span className="font-medium">{totalItems}</span> results
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 sm:px-6 border-t border-gray-200 ${className}`}
    >
      {/* Showing info */}
      <div className="text-sm text-gray-700">
        {totalItems ? (
          <>
            Showing <span className="font-medium">{from}</span> to{" "}
            <span className="font-medium">{to}</span> of{" "}
            <span className="font-medium">{totalItems}</span> results
          </>
        ) : (
          <>
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* First page button */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`
            p-2 rounded-lg border transition-all
            ${
              currentPage === 1
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            }
          `}
          title="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            p-2 rounded-lg border transition-all
            ${
              currentPage === 1
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            }
          `}
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-1 text-gray-500"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`
                  min-w-10 px-3 py-1 rounded-lg border text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600 cursor-default"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                  }
                `}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Mobile page indicator */}
        <div className="sm:hidden px-3 py-1 text-sm font-medium text-gray-700">
          {currentPage} / {totalPages}
        </div>

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            p-2 rounded-lg border transition-all
            ${
              currentPage === totalPages
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            }
          `}
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Last page button */}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`
            p-2 rounded-lg border transition-all
            ${
              currentPage === totalPages
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            }
          `}
          title="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
