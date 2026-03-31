import { useParams, useSearchParams } from "react-router-dom";
import AnimeCard from "../components/AnimeCard";
import { useFetchAnime } from "../hook/useFetchAnime";
import Pagination from "../components/Pagination";

export default function Anime() {
  const [searchParams] = useSearchParams();
  const { query, genreId, genreName, season } = useParams();
  const currentPage = searchParams.get("page") || 1;

  const fetchParams = {
    page: currentPage,
    limit: 24,
  };

  let endpoint = 'anime'
  if (genreId) {
    fetchParams.genres = genreId;
  } else if (query && query !== "undefined") {
    fetchParams.q = query;
  } else if (season){
    endpoint = `seasons/${season}`
  }

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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 justify-items-center lg:justify-items-startr">
          {Array(10).fill(0).map((_, i) => (
            <AnimeCard key={i} isLoading={true} />
          ))}
        </div>
      ) : animeSearch && animeSearch.length > 0 ? (
        <>
          <div>
            <h2 className="text-2xl font-bold mb-1 uppercase tracking-tight">
              {getPageTitle()}
            </h2>
            <p className="text-muted text-sm mb-6">
              {pagination?.items?.total || 0} results found
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 justify-items-center lg:justify-items-start">
            {animeSearch.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} isLoading={false} />
            ))}
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
      <div className="mt-10 justify-center flex flex-col-1 items-center">
        <Pagination lastPage={pagination?.last_visible_page || 1} />
      </div>
    </div>
  );
}