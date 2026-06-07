import { useMemo } from "react";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import AnimeCard from "../components/AnimeCard";
import { useFetchAnime } from "../hook/useFetchAnime";
import Pagination from "../components/Pagination";

const SORT_OPTIONS = [
  { label: "By Rating",   key: "rating",     orderBy: "score" },
  { label: "Latest",      key: "latest",      orderBy: "start_date" },
  { label: "Popularity",  key: "popularity",  orderBy: "popularity" },
];

export default function Anime() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { query, genreId, genreName, season, year, type } = useParams();
  const location = useLocation();

  const isMoviePage = type === "movie" || location.pathname.includes("/movie");
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const orderBy = searchParams.get("order_by");
  const sortDir = searchParams.get("sort");

  const { endpoint, finalParams } = useMemo(() => {
    let endpoint = "anime";
    const params = { page: currentPage, limit: 25 };

    if (orderBy) params.order_by = orderBy;
    if (sortDir) params.sort = sortDir;

    if (isMoviePage) {
      params.type = "movie";
      if (!orderBy) params.order_by = "popularity";
    } else if (genreId) {
      params.genres = genreId;
    } else if (query && query !== "undefined") {
      params.q = query;
    } else if (season === "now") {
      endpoint = `seasons/${season}`;
    } else if (season) {
      endpoint = `seasons/${year}/${season}`;
    } else if (location.pathname.includes("/top-anime")) {
      endpoint = "top/anime";
    }

    return { endpoint, finalParams: params };
  }, [currentPage, orderBy, sortDir, query, genreId, season, year, isMoviePage, location.pathname]);

  const { data: animeList, loading, pagination } = useFetchAnime(endpoint, finalParams);

  const handleSort = (key) => {
    const params = new URLSearchParams(searchParams);
    if (key === "rating") {
      params.set("order_by", "score");
      params.set("sort", "desc");
    } else if (key === "popularity") {
      params.set("order_by", "popularity");
      params.set("sort", isMoviePage ? "desc" : "asc");
    } else if (key === "latest") {
      params.set("order_by", "start_date");
      params.set("sort", "desc");
    } else {
      params.delete("order_by");
      params.delete("sort");
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const isActive = (opt) =>
    opt.orderBy === orderBy || (opt.key === "popularity" && !orderBy && isMoviePage);

  const pageTitle = () => {
    if (isMoviePage) return "Anime Movies";
    if (genreId)          return `Genre: ${genreName}`;
    if (season === "now") return "Current Season Anime";
    if (season)           return `Season: ${season}`;
    if (query && query !== "undefined") return `Search Results for "${query}"`;
    return "All Anime";
  };

  return (
    <div className="min-h-screen px-4 md:px-12 lg:px-24 py-10 text-bright">

      {/* Header */}
      <div className="mb-8 border-b border-white/5 pb-6 space-y-4">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-tight text-bright">
            {pageTitle()}
          </h2>
          <p className="text-muted text-sm mt-1">
            {pagination?.items?.total || 0} results found
          </p>
        </div>

        {/* Sort buttons */}
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleSort(opt.key)}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive(opt)
                  ? "bg-primary text-background"
                  : "bg-white/10 hover:bg-white/20 text-bright"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <AnimeCard key={i} isLoading />
          ))}
        </div>
      )}

      {!loading && animeList?.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-6">
            {animeList.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Pagination lastPage={pagination?.last_visible_page || 1} />
          </div>
        </>
      )}

      {!loading && !animeList?.length && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
          <h3 className="text-xl font-bold text-muted uppercase">
            {isMoviePage ? "No Movies Found" : "No Anime Found"}
          </h3>
          <p className="text-muted text-sm">
            Try resetting your sorting configuration or check your internet connection.
          </p>
        </div>
      )}

    </div>
  );
} 