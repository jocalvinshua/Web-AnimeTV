import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Pagination({ lastPage }) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentPage = Number(searchParams.get("page")) || 1;

  const handlePagination = (page) => {
    if (page < 1 || page > lastPage) return;
    
    searchParams.set("page", page);
    setSearchParams(searchParams);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(lastPage, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-10 mb-20">
      <div className="flex items-center justify-between w-full max-w-md text-muted font-medium">
        
        <button 
          disabled={currentPage === 1}
          onClick={() => handlePagination(1)}
          className="rounded-full hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronsLeft width={30} height={30} color="currentColor" />
        </button>
        <button 
          disabled={currentPage === 1}
          onClick={() => handlePagination(currentPage - 1)}
          className="rounded-full hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronLeft width={30} height={30} color="currentColor" />
        </button>

        <div className="flex items-center gap-1 md:gap-2 text-sm font-medium">
          {getPageNumbers().map((pageNum) => (
            <button 
              key={pageNum}
              onClick={() => handlePagination(pageNum)} 
              className={`h-10 w-10 flex items-center justify-center rounded-full transition-all ${
                currentPage === pageNum 
                ? "text-primary border border-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]" 
                : "text-muted hover:bg-white/5 hover:text-bright" 
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Tombol Next */}
        <button 
          disabled={currentPage === lastPage}
          onClick={() => handlePagination(currentPage + 1)}
          className="rounded-full hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronRight width={30} height={30} color="currentColor" />
        </button>
        <button 
          disabled={currentPage === lastPage}
          onClick={() => handlePagination(lastPage)}
          className="rounded-full hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronsRight width={30} height={30} color="currentColor" />
        </button>
      </div>
    </div>
  );
}