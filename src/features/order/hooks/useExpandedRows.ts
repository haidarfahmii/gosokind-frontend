import { useState, useCallback } from "react";

/**
 * Hook untuk mengelola state expanded rows pada tabel.
 * Mendukung toggle expand per row berdasarkan ID.
 */
export function useExpandedRows() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = useCallback((id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isExpanded = useCallback(
    (id: string) => expandedRows.has(id),
    [expandedRows],
  );

  const collapseAll = useCallback(() => {
    setExpandedRows(new Set());
  }, []);

  return { isExpanded, toggleRow, collapseAll };
}
