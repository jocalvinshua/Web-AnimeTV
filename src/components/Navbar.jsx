import { useEffect, useState } from "react";
import { Search, X, Star, Play } from "lucide-react";
import { Link, useNavigate, NavLink,  } from "react-router-dom";
import githubIcon from "../assets/github-icon.svg";
import { useFetchAnime } from "../hook/useFetchAnime";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const navigate = useNavigate();

  // Debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Suggested search
  const { data: suggestions, loading: isSuggesting } = useFetchAnime(
    debouncedSearch.length >= 3 ? "anime" : null,
    { q: debouncedSearch, limit: 3 } 
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/anime/${search}`);
      // Tutup modal dan reset input
      setIsSearchOpen(false);
      setSearch("");
    }
  };

  const handleSelectSuggestion = (id) => {
    navigate(`/anime-details/${id}`);
    setIsSearchOpen(false);
    setSearch("");
  };

  return (
    <>
      <nav className="bg-navbar sticky top-0 h-[70px] w-full px-4 md:px-12 lg:px-24 flex items-center justify-between z-50 backdrop-blur-md text-bright shadow-lg border-b border-white/5 transition-all mb-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <h1 className="text-xl font-extrabold tracking-tight text-bright">
              Anime<span className="text-primary">TV</span>
            </h1>
            <svg
              className="w-6 h-6 text-primary group-hover:animate-pulse"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 2.286a1 1 0 001.414 0L21 5M13 7h8m-8 4h8m-8 4h8m-8 4h8"
              />
            </svg>
          </Link>
        </div>

        {/* Navlink */}
        <div className="flex items-center gap-4 flex-1 justify-center">
          <NavLink
            to="/anime/genres"
            className="text-bright hover:text-primary transition-colors"
          >
            Genres
          </NavLink>
          <NavLink
            to="/anime/seasons"
            className="text-bright hover:text-primary transition-colors"
          >
            Season
          </NavLink>
          <NavLink
            to="/anime/top"
            className="text-bright hover:text-primary transition-colors"
          >
            Top Anime
          </NavLink>
        </div>
        <div className="flex items-center gap-4 flex-1 justify-end max-w-xl">
          {/* Github Logo */}
          <a
            href="https://github.com/jocalvinshua/Web-AnimeTV"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center"
            title="View Source on GitHub"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 fill-current text-muted hover:text-bright transition-colors"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* --- SEARCH MODAL OVERLAY --- */}
      <div
        className={`fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 transition-all duration-300 ${isSearchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          onClick={() => setIsSearchOpen(false)}
        ></div>

        <div
          className={`relative w-full max-w-2xl bg-card border border-white/10 rounded-3xl shadow-2xl transition-all duration-500 transform overflow-hidden ${isSearchOpen ? "translate-y-0 scale-100" : "-translate-y-15 scale-95"}`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-bright flex items-center gap-2">
                <Search size={20} className="text-primary" /> Search Anime
              </h3>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-muted hover:text-bright"
              >
                <X size={24} />
              </button>
            </div>

            <form className="relative" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Type anime title..."
                autoFocus={isSearchOpen}
                className="w-full bg-background border-2 border-white/5 focus:border-primary/50 rounded-2xl py-4 pl-6 pr-14 outline-none text-bright text-lg transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {isSuggesting && (
                <div className="absolute right-14 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <button
                type="submit"
                className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
              >
                <Search size={24} />
              </button>
            </form>

            {/* --- LIST SUGGESTIONS --- */}
            {search.length >= 3 && (
              <div className="mt-4 space-y-2 border-t border-white/5 pt-4 max-h-[400px] overflow-y-auto pr-2">
                {suggestions?.length > 0
                  ? suggestions.map((anime) => (
                      <div
                        key={anime.mal_id}
                        onClick={() => handleSelectSuggestion(anime.mal_id)}
                        className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-all group"
                      >
                        <img
                          src={anime.images.jpg.small_image_url}
                          alt=""
                          className="w-12 h-16 object-cover rounded-lg shadow-md"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-bright group-hover:text-primary transition-colors line-clamp-1">
                            {anime.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-[10px] text-yellow-400 font-bold">
                              <Star size={10} fill="currentColor" />{" "}
                              {anime.score || "N/A"}
                            </span>
                            <span className="text-[10px] text-muted uppercase font-bold">
                              {anime.type} • {anime.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  : !isSuggesting && (
                      <p className="text-center py-4 text-muted text-sm italic">
                        No results found for "{search}"
                      </p>
                    )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
