import { useParams } from "react-router-dom";
import AnimeCard from "../components/AnimeCard";
import { useFetchAnime } from "../hook/useFetchAnime";

export default function Anime() {
  const { query } = useParams();

  const { data: animeSearch, loading } = useFetchAnime(`anime?q=${query}&limit=20`);

  return (
    <div className="min-h-screen px-4 md:px-12 lg:px-24 py-10">
      {/* Header Info */}
      <div className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight">
          Search Results for: <span className="text-primary">"{query}"</span>
        </h2>
        {!loading && animeSearch?.length > 0 && (
          <p className="text-muted text-sm mt-2">Found {animeSearch.length} titles</p>
        )}
      </div>

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
    </div>
  );
}