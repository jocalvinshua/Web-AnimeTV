import { useState } from 'react';
import { Search, X } from 'lucide-react'; // Menggunakan lucide untuk ikon
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      // navigate(`/search?q=${encodeURIComponent(search)}`);
      navigate(`/anime/${search}`)
      // Tutup modal dan reset input
      setIsSearchOpen(false);
      setSearch("");
    }
  };

  return (
    <>
      <nav className="bg-navbar sticky top-0 h-[70px] w-full px-4 md:px-12 lg:px-24 flex items-center justify-between z-50 backdrop-blur-md text-bright shadow-lg border-b border-white/5 transition-all mb-6">
        
        {/* Logo Section */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <h1 className="text-xl font-extrabold tracking-tight text-bright">
              Anime<span className="text-primary">TV</span>
            </h1>
            <svg className="w-6 h-6 text-primary group-hover:animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 2.286a1 1 0 001.414 0L21 5M13 7h8m-8 4h8m-8 4h8m-8 4h8" />
            </svg>
          </Link>
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end max-w-xl">
          <button 
            onClick={() => setIsSearchOpen(true)} 
            className="bg-transparent p-2 transition-all duration-300 ease-out hover:scale-110 active:scale-95 text-bright hover:text-primary"
          >
            <Search size={24} />
          </button>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 md:hidden hover:bg-card rounded-lg transition-colors text-bright"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* --- SEARCH MODAL OVERLAY --- */}
      <div className={`
        fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 transition-all duration-300
        ${isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-xl"
          onClick={() => setIsSearchOpen(false)}
        ></div>

        <div className={`
          relative w-full max-w-2xl bg-card border border-white/10 p-6 rounded-3xl shadow-2xl transition-all duration-500 transform
          ${isSearchOpen ? 'translate-y-0 scale-100' : '-translate-y-12 scale-95'}
        `}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-bright flex items-center gap-2">
              <Search size={20} className="text-primary" />
              Search Anime
            </h3>
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-muted hover:text-bright"
            >
              <X size={24} />
            </button>
          </div>

          <form className="relative group" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Type anime title..." 
              autoFocus={isSearchOpen}
              className="w-full bg-background border-2 border-white/5 focus:border-primary/50 rounded-2xl py-4 pl-6 pr-14 outline-none text-bright transition-all text-lg shadow-inner"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors">
                <Search size={24} />
            </button>
          </form>
          
          <p className="mt-4 text-xs text-muted">
            Press <span className="text-primary font-bold">Enter</span> to search.
          </p>
        </div>
      </div>
    </>
  );
}