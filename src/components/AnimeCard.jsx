import { useNavigate } from "react-router-dom";

export default function AnimeCard({ anime, isLoading }) {
  const navigate = useNavigate();

  const handleDetails = () => {
    if (anime?.mal_id) {
      navigate(`/anime-details/${anime.mal_id}`);
    }
  };

  return (
    /* Ternary dimulai di sini */
    isLoading || !anime ? (
      /* --- STATE LOADING (SKELETON) --- */
      <div className="relative w-[232px] h-[458px] bg-card rounded-2xl overflow-hidden shadow-sm border border-white/5">
        <div className="w-full h-[320px] bg-gray-800 animate-pulse" />
        <div className="p-5 space-y-4">
          <div className="h-4 w-full bg-gray-700 rounded-full animate-pulse" />
          <div className="h-4 w-2/3 bg-gray-700 rounded-full animate-pulse" />
          <div className="h-5 w-16 bg-gray-800 rounded-md animate-pulse" />
        </div>
      </div>
    ) : (
      /* --- STATE DATA TERSEDIA --- */
      <div 
        className="relative w-[232px] h-[458px] bg-card rounded-2xl overflow-hidden shadow-md border border-white/5 flex flex-col cursor-pointer hover:ring-2 hover:ring-primary transition-all group" 
        onClick={handleDetails}
      >
        {/* Area Poster */}
        <div className="relative w-full h-[320px] bg-gray-900 overflow-hidden">
          <img 
            src={anime.images?.jpg?.large_image_url} 
            alt={anime.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className="bg-primary text-[10px] font-bold text-white px-2 py-0.5 rounded uppercase">
              {anime.type}
            </span>
            <span className="bg-black/60 text-[10px] font-bold text-white px-2 py-0.5 rounded">
              {anime.rating?.split(' ')[0] || "13+"}
            </span>
          </div>
          <div className="absolute top-3 right-3 bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-black shadow-lg">
            ★ {anime.score || "0.0"}
          </div>
        </div>

        {/* Info Detail */}
        <div className="p-4 flex flex-col justify-between flex-1">
          <h4 className="text-bright font-bold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {anime.title}
          </h4>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="text-[10px] font-bold text-bright bg-primary text-primary border border-primary px-2 py-1 rounded ">
              {anime.genres?.[0]?.name || "Anime"}
            </span>
            <span className="text-[11px] text-muted font-semibold">
              {anime.episodes ? `${anime.episodes} EPS` : "Ongoing"}
            </span>
          </div>
        </div>
      </div>
    )
  );
}