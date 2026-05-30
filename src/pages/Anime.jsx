import { useMemo } from "react";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import AnimeCard from "../components/AnimeCard";
import { useFetchAnime } from "../hook/useFetchAnime";
import Pagination from "../components/Pagination";

export default function Anime() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { query, genreId, genreName, season, year, type } = useParams();
  const location = useLocation();

  const isMoviePage = type === "movie" || location.pathname.includes("/movie");

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const orderBy = searchParams.get("order_by");
  const sortDir = searchParams.get("sort");

  const { endpoint, finalParams } = useMemo(() => {
    let currentEndpoint = "anime";
    const params = {
      page: currentPage,
      limit: 25,
    };

    if (orderBy) params.order_by = orderBy;
    if (sortDir) params.sort = sortDir;

    if (isMoviePage) {
      params.type = "movie";
      if (!orderBy) {
        params.order_by = "popularity";
      }
    } else if (genreId) {
      params.genres = genreId;
    } else if (query && query !== "undefined") {
      params.q = query;
    } else if (season === "now") {
      currentEndpoint = `seasons/${season}`;
    } else if (season) {
      currentEndpoint = `seasons/${year}/${season}`;
    } else if (location.pathname.includes("/top-anime")) {
      currentEndpoint = "top/anime";
    }

    return { endpoint: currentEndpoint, finalParams: params };
  }, [currentPage, orderBy, sortDir, query, genreId, season, year, isMoviePage, location.pathname]);

  const {
    data: animeSearch,
    loading,
    pagination,
  } = useFetchAnime(endpoint, finalParams);

  const handleSort = (sortBy) => {
    const newParams = new URLSearchParams(searchParams);
    switch (sortBy) {
      case "rating":
        newParams.set("order_by", "score");
        newParams.set("sort", "desc");
        break;
      case "popularity":
        newParams.set("order_by", "popularity");
        newParams.set("sort", isMoviePage ? "desc" : "asc");
        break;
      case "latest":
        newParams.set("order_by", "start_date");
        newParams.set("sort", "desc");
        break;
      default:
        newParams.delete("order_by");
        newParams.delete("sort");
        break;
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const getPageTitle = () => {
    if (isMoviePage) return "Anime Movies";
    if (genreId) return `Genre: ${genreName}`;
    if (season === "now") return "Current Season Anime";
    if (season) return `Season: ${season}`;
    if (query && query !== "undefined") return `Search Results for "${query}"`;
    return "All Anime";
  };

  return (
    <div className="min-h-screen px-4 md:px-12 lg:px-24 py-10 text-bright">
      {/* Header & Filter Layout */}
      <div className="mb-8 border-b border-white/5 pb-6">
        <h2 className="text-2xl font-bold mb-1 uppercase tracking-tight text-bright">
          {getPageTitle()}
        </h2>
        <p className="text-muted text-sm mb-6">
          {pagination?.items?.total || 0} results found
        </p>

        {/* Sorting Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleSort("rating")}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
              orderBy === "score"
                ? "bg-primary text-background"
                : "bg-white/10 hover:bg-white/20 text-bright"
            }`}
          >
            By Ratings
          </button>
          <button
            onClick={() => handleSort("latest")}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
              orderBy === "start_date"
                ? "bg-primary text-background"
                : "bg-white/10 hover:bg-white/20 text-bright"
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => handleSort("popularity")}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
              orderBy === "popularity" || (!orderBy && isMoviePage)
                ? "bg-primary text-background"
                : "bg-white/10 hover:bg-white/20 text-bright"
            }`}
          >
            Popularity
          </button>
        </div>
      </div>

      {loading ? (
        /* Skeleton Cards */
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 justify-items-center lg:justify-items-start">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <AnimeCard key={i} isLoading={true} />
            ))}
        </div>
      ) : animeSearch && animeSearch.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 justify-items-center lg:justify-items-start">
            {animeSearch.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} isLoading={false} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <Pagination lastPage={pagination?.last_visible_page || 1} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-xl font-bold text-muted uppercase">
            {isMoviePage ? "No Movies Found" : "No Anime Found"}
          </h3>
          <p className="text-muted mt-2 text-sm">
            Try resetting your sorting configuration or check your internet connection.
          </p>
        </div>
      )}
    </div>
  );
}