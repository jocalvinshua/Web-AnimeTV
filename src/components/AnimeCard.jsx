import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react"; // Import icon sampah

export default function AnimeCard({
  anime,
  isLoading,
  mode = "general",
  rank = null,
  onRemoveFavorite = null,
}) {
  const navigate = useNavigate();

  const handleDetails = () => {
    const targetId = anime?.mal_id || anime?.id;
    if (targetId) {
      navigate(`/anime-details/${targetId}`);
    }
  };

  const getRankBadgeColor = (globalRank) => {
    if (globalRank === 1) return "bg-yellow-500 text-black font-black";
    if (globalRank === 2) return "bg-slate-300 text-black font-black";
    if (globalRank === 3) return "bg-amber-600 text-white font-black";
    return "bg-black/60 text-bright border border-white/10 backdrop-blur-md";
  };

  const animeImage = anime?.images?.jpg?.large_image_url || anime?.image;

  return isLoading || !anime ? (
    <div className="relative w-[200px] h-[380px] bg-transparent rounded-2xl overflow-hidden shadow-sm border border-white/5">
      <div className="w-full h-[270px] bg-gray-800 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-3.5 w-full bg-gray-700 rounded-full animate-pulse" />
        <div className="h-3.5 w-2/3 bg-gray-700 rounded-full animate-pulse" />
        <div className="h-4 w-14 bg-gray-800 rounded-md animate-pulse" />
      </div>
    </div>
  ) : (
    /* --- STATE DATA TERSEDIA --- */
    <div className="relative w-[200px] h-[380px] bg-transparent rounded-2xl overflow-hidden shadow-md border border-transparent flex flex-col cursor-pointer transition-all group">
      {/* Area Poster */}
      <div
        onClick={handleDetails}
        className="relative w-full h-[270px] bg-gray-900 overflow-hidden rounded-2xl"
      >
        <img
          src={animeImage}
          alt={anime.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {mode === "general" ? (
          <>
            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
              <span className="bg-primary text-[9px] font-bold text-white px-1.5 py-0.5 rounded uppercase tracking-wide">
                {anime.type || "TV"}
              </span>
              {anime.rating && (
                <span className="bg-black/60 text-[9px] font-bold text-white px-1.5 py-0.5 rounded">
                  {anime.rating.split(" ")[0]}
                </span>
              )}
            </div>
            <div className="absolute top-2.5 right-2.5 bg-yellow-500 text-black px-1.5 py-0.5 rounded text-[11px] font-black shadow-lg">
              ★ {anime.score || "0.0"}
            </div>
          </>
        ) : mode === "favorite" ? (
          <>
            <div className="absolute top-2.5 left-2.5 bg-yellow-500 text-black px-1.5 py-0.5 rounded text-[11px] font-black shadow-lg">
              ★ {anime.score || "0.0"}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); 
                if (onRemoveFavorite) onRemoveFavorite(anime.id || anime.mal_id);
              }}
              className="absolute top-2.5 right-2.5 p-1.5 bg-red-600 text-white rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hover:bg-red-700"
              title="Remove from Favorites"
            >
              <Trash2 size={13} />
            </button>
          </>
        ) : (
          <>
            <div
              className={`absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-xl text-[10px] flex items-center gap-0.5 shadow-2xl transition-transform duration-300 group-hover:scale-110 ${getRankBadgeColor(rank)}`}
            >
              <span>#</span>
              <span className="text-xs">{rank}</span>
            </div>
            <div className="absolute top-2.5 right-2.5 bg-yellow-500 text-black px-1.5 py-0.5 rounded text-[11px] font-black shadow-lg">
              ★ {anime.score || "0.0"}
            </div>
          </>
        )}
      </div>

      {/* Info Detail */}
      <div className="p-3 flex flex-col justify-between flex-1">
        <h4
          onClick={handleDetails}
          className="text-bright font-bold text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors uppercase tracking-wide"
        >
          {anime.title}
        </h4>

        <div className="flex items-center justify-between mt-2">
          <span className="text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded max-w-[95px] truncate">
            {anime.genres?.[0]?.name || "Anime"}
          </span>
          <span className="text-[10px] text-muted font-semibold shrink-0">
            {anime.episodes ? `${anime.episodes} EPS` : "Ongoing"}
          </span>
        </div>
      </div>
    </div>
  );
}