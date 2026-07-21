import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  currentPage, // 0-based
  totalPages,  // total pages count
  onPageChange,
  className,
}) {
  const isFirstPage = currentPage <= 0;
  const isLastPage = currentPage >= totalPages - 1;

  return (
    <div className={className ?? "flex justify-center items-center space-x-2 mt-4"}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        className="p-2 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
      >
        <ChevronLeft size={16} />
      </button>

      <span className="px-2">
        Page {currentPage + 1} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLastPage}
        className="p-2 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
