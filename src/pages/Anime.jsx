import { useParams, useSearchParams } from "react-router-dom";
import AnimeCard from "../components/AnimeCard";
import { useFetchAnime } from "../hook/useFetchAnime";
import Pagination from "../components/Pagination";

export default function Anime() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { query, genreId, genreName, season, year } = useParams();
  const currentPage = searchParams.get("page") || 1;
  const orderBy = searchParams.get("order_by"); // Ambil dari URL
  const sortDir = searchParams.get("sort");     // Ambil dari URL

  const fetchParams = {
    page: currentPage,
    limit: 24,
  };

  if (orderBy) fetchParams.order_by = orderBy;
  if (sortDir) fetchParams.sort = sortDir;

  let endpoint = 'anime'
  if (genreId) {
    fetchParams.genres = genreId;
  } else if (query && query !== "undefined") {
    fetchParams.q = query;
  } else if (season === 'now'){
    endpoint = `seasons/${season}`
  } else if (season){
    endpoint = `seasons/${year}/${season}`
  } else if(top){
    endpoint = 'top/anime'
  }

  const handleSort = (sortBy) => {
    const newParams = new URLSearchParams(searchParams);
    switch(sortBy){
      case 'rating':
        newParams.set("order_by", "score")
        newParams.set("sort", 'desc')
        break;
      case 'popularity':
        newParams.set("order_by", "popularity")
        newParams.set("sort", "asc")
        break;
      case 'latest':
        newParams.set('order_by', 'start_date')
        newParams.set('sort', 'desc')
        break;
      default:
        newParams.delete("order_by");
        newParams.delete("sort");
        break;
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const { data: animeSearch, loading, pagination } = useFetchAnime(endpoint, fetchParams);

  const getPageTitle = () => {
    if (genreId) return `Genre: ${genreName}`;
    if (season === 'now') return "Current Season Anime";
    if (season) return `Season: ${season}`;
    if (query && query !== "undefined") return `Search Results for "${query}"`;
    return "All Anime";
  };

  return (
    <div className="min-h-screen px-4 md:px-12 lg:px-24 py-10">
      {loading ? (
        // Skeleton Card
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 justify-items-center lg:justify-items-startr">
          {Array(10).fill(0).map((_, i) => (
            <AnimeCard key={i} isLoading={true} />
          ))}
        </div>
      ) : animeSearch && animeSearch.length > 0 ? (
        <>
        {/* Results */}
          <div>
            <h2 className="text-2xl font-bold mb-1 uppercase tracking-tight">
              {getPageTitle()}
            </h2>
            <p className="text-muted text-sm mb-6">
              {pagination?.items?.total || 0} results found
            </p>
          </div>

          {/* Sorting Button */}
          <div className="flex flex-wrap flex-col-1 items-center justify-items-center gap-2">
            <button
              onClick={()=>handleSort('rating')}
              className="bg-white/10 hover:bg-white/20 text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md mb-10"
            >
              By Ratings
            </button>
            <button
              onClick={()=>handleSort('latest')}
              className="bg-white/10 hover:bg-white/20 text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md mb-10"
            >
              Latest
            </button>
            <button
              onClick={()=>handleSort('popularity')}
              className="bg-white/10 hover:bg-white/20 text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md mb-10"
            >
              Popularity
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 justify-items-center lg:justify-items-start">
            {animeSearch.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} isLoading={false} />
            ))}
          </div>
            <div className="mt-10 justify-center flex flex-col-1 items-center">
              <Pagination lastPage={pagination?.last_visible_page || 1} />
            </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">empty</div>
          <h3 className="text-xl font-bold text-muted uppercase">
            {genreId 
              ? `No Anime Found for this Genre` 
              : `No Anime Found for "${query}"`}
          </h3>
          <p className="text-muted mt-2">Try searching with different keywords.</p>
        </div>
      )}
      
    </div>
  );
}