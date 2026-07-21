import React from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "./Button";

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems = 0,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  loading = false,
  variant = "default", // 'default', 'minimal', or 'enterprise'
  className,
  pageSizeOptions = [10, 25, 50, 100], // Added default options
}) => {
  const jumpRef = React.useRef(null);

  const handleJumpToPage = (e) => {
    if (e.key === "Enter") {
      const page = parseInt(jumpRef.current.value);
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
        jumpRef.current.value = "";
      }
    }
  };

  // Helper to generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        if (totalPages > 5) pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        if (totalPages > 5) pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        if (currentPage > 3) pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (totalItems === 0 && (!itemsPerPage || !onItemsPerPageChange)) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row items-center justify-between gap-4 py-3 px-4 bg-white/80 rounded-2xl border border-emerald-100/50 backdrop-blur-md shadow-sm transition-all",
        className,
      )}
    >
      {/* Info Section */}
      <div className="flex flex-col xs:flex-row items-center gap-4 w-full lg:w-auto">
        {itemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              disabled={loading}
              className="bg-transparent text-emerald-700 focus:outline-none cursor-pointer font-extrabold"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="hidden xs:inline">per page</span>
          </div>
        )}

        {variant === "enterprise" && (
          <div className="text-xs font-bold text-gray-400">
            Showing{" "}
            <span className="text-emerald-600">
              {totalItems > 0 ? startItem : 0}
            </span>
            -<span className="text-emerald-600">{endItem}</span> of
            <span className="text-gray-700 ml-1">
              {totalItems.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 sm:gap-4 w-full lg:w-auto">
        {/* Fixed Navigation Controls */}
        <div className="flex items-center gap-1.5">
          {variant === "enterprise" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1 || loading}
              className="hidden xs:flex h-8 px-2 text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
            >
              First
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="h-9 px-3 gap-2 border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all active:scale-95 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden xs:inline text-xs font-bold">Prev</span>
          </Button>
        </div>

        {variant === "minimal" ? (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-xs font-bold text-gray-400">Page</span>
            <span className="text-xs font-extrabold text-emerald-600">
              {currentPage}
            </span>
            <span className="text-xs font-bold text-gray-400">of</span>
            <span className="text-xs font-extrabold text-gray-700">
              {totalPages || 1}
            </span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="text-gray-400 text-sm px-1.5 font-bold">
                    ...
                  </span>
                ) : (
                  <Button
                    variant={currentPage === page ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    disabled={loading}
                    className={cn(
                      "h-8 min-w-[32px] p-0 font-bold text-xs transition-all duration-200",
                      currentPage === page
                        ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-200"
                        : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700",
                    )}
                  >
                    {currentPage === page && loading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      page
                    )}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="h-9 px-3 gap-2 border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all active:scale-95 disabled:opacity-40"
          >
            <span className="hidden xs:inline text-xs font-bold">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>

          {variant === "enterprise" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages || loading}
                className="hidden xs:flex h-8 px-2 text-[10px] uppercase tracking-wider font-bold text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
              >
                Last
              </Button>

              <div className="hidden lg:flex items-center gap-2 ml-2 border-l border-gray-200 pl-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                  Go to
                </span>
                <input
                  ref={jumpRef}
                  type="number"
                  placeholder={currentPage}
                  onKeyDown={handleJumpToPage}
                  className="w-12 h-8 bg-gray-50 border border-gray-200 rounded-lg text-center text-xs font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};