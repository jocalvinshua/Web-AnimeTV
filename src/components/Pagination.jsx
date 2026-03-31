import { useSearchParams } from "react-router-dom";

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
          onClick={() => handlePagination(currentPage - 1)}
          className="rounded-full hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z" fill="currentColor"/>
          </svg>
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
          <svg className="rotate-180" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M22.499 12.85a.9.9 0 0 1 .57.205l.067.06a.9.9 0 0 1 .06 1.206l-.06.066-5.585 5.586-.028.027.028.027 5.585 5.587a.9.9 0 0 1 .06 1.207l-.06.066-1.207.06l-.066-.06-6.25-6.25a1 1 0 0 1-.158-.212l-.038-.08a.9.9 0 0 1-.03-.606l.03-.083a1 1 0 0 1 .137-.226l.06-.066 6.25-6.25a.9.9 0 0 1 .635-.263Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  );
}