import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ChevronLeft, HeartCrack } from "lucide-react";
import AnimeCard from "../components/AnimeCard";

export default function AnimeFavorites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const localData = localStorage.getItem("Anime-Favorites");
    if (localData) setFavorites(JSON.parse(localData));
    document.title = "My Favorites | AnimeTV";
  }, []);

  const removeFavorite = (id) => {
    const updated = favorites.filter((item) => item.id !== id);
    setFavorites(updated);
    localStorage.setItem("Anime-Favorites", JSON.stringify(updated));
  };

  const clearAllFavorites = () => {
    if (!window.confirm("Hapus semua favorit?")) return;
    setFavorites([]);
    localStorage.removeItem("Anime-Favorites");
  };

  return (
    <div className="min-h-screen bg-background text-bright">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div className="space-y-1">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 text-xs text-muted hover:text-primary transition-colors mb-1 group"
            >
              <ChevronLeft
                size={14}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
              Back
            </button>
            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white">
              My <span className="text-primary">Favorites</span>
            </h1>
            {favorites.length > 0 && (
              <p className="text-xs text-muted font-medium">
                {favorites.length} anime tersimpan
              </p>
            )}
          </div>

          {favorites.length > 0 && (
            <button
              onClick={clearAllFavorites}
              className="inline-flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all self-start sm:self-auto"
            >
              <Trash2 size={13} />
              Delete All
            </button>
          )}
        </div>

        {/* Empty state */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-white/8 rounded-2xl">
            <HeartCrack size={44} className="text-muted/30 mb-4" />
            <h3 className="text-base font-black uppercase tracking-wider text-white mb-1">
              There is no favorites list yet
            </h3>
            <p className="text-xs text-muted max-w-xs mb-6 leading-relaxed">
              You haven't added any anime yet
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-primary text-background font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all"
            >
              Browser Anime
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favorites.map((anime) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                mode="favorite"
                isLoading={false}
                onRemoveFavorite={removeFavorite} // Hubungkan fungsi remove dari parent state Anda ke sini
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
