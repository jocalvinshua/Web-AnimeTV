import { useParams, useSearchParams } from "react-router-dom";
import AnimeCard from "../components/AnimeCard";
import { useFetchAnime } from "../hook/useFetchAnime";
import Pagination from "../components/Pagination";

export default function Anime() {
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get("page") || 1;
  const { query } = useParams();

  const { data: animeSearch, loading, pagination } = useFetchAnime(`anime`,{
    q: query,
    page: currentPage
  });

  return (
    <div className="min-h-screen px-4 md:px-12 lg:px-24 py-10">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 justify-items-center lg:justify-items-startr">
          {Array(10).fill(0).map((_, i) => (
            <AnimeCard key={i} isLoading={true} />
          ))}
        </div>
      ) : animeSearch && animeSearch.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 justify-items-center lg:justify-items-start">
          {animeSearch.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} isLoading={false} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">empty</div>
          <h3 className="text-xl font-bold text-muted uppercase">
            No Anime Found for "{query}"
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