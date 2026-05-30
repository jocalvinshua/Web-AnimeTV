import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Pagination({ lastPage }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const handlePagination = (page) => {
    if (page < 1 || page > lastPage) return;
    
    searchParams.set("page", page);
    setSearchParams(searchParams);
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(lastPage, start + 3);

    if (end - start < 3) {
      start = Math.max(1, end - 3);
    }

    if (window.innerWidth >= 768) {
      start = Math.max(1, currentPage - 2);
      end = Math.min(lastPage, start + 4);
      if (end - start < 4) start = Math.max(1, end - 4);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-2 text-muted font-medium my-10 max-w-full px-2">
      
      {/* Group Tombol Navigasi Kiri */}
      <div className="flex items-center gap-1">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePagination(1)}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed text-bright/80"
        >
          <ChevronsLeft size={20} className="md:w-6 md:h-6" color="currentColor" />
        </button>
        <button
          disabled={currentPage === 1}
          onClick={() => handlePagination(currentPage - 1)}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed text-bright/80"
        >
          <ChevronLeft size={20} className="md:w-6 md:h-6" color="currentColor" />
        </button>
      </div>

      {/* Group Angka Halaman */}
      <div className="flex items-center gap-1 sm:gap-1.5 text-xs md:text-sm font-semibold">
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePagination(pageNum)}
            className={`h-8 w-8 md:h-10 md:w-10 flex items-center justify-center rounded-full transition-all ${
              currentPage === pageNum
                ? "text-primary border border-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] font-bold"
                : "text-muted hover:bg-white/5 hover:text-bright"
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>

      {/* Group Tombol Navigasi Kanan */}
      <div className="flex items-center gap-1">
        <button
          disabled={currentPage === lastPage}
          onClick={() => handlePagination(currentPage + 1)}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed text-bright/80"
        >
          <ChevronRight size={20} className="md:w-6 md:h-6" color="currentColor" />
        </button>
        <button
          disabled={currentPage === lastPage}
          onClick={() => handlePagination(lastPage)}
          className="p-1.5 rounded-full hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed text-bright/80"
        >
          <ChevronsRight size={20} className="md:w-6 md:h-6" color="currentColor" />
        </button>
      </div>

    </div>
  );
}