import { useState, useMemo, useCallback } from "react";
import { useFetchAnime } from "../hook/useFetchAnime";
import { useSearchParams } from "react-router-dom";
import { Trophy, Star, Tv, Clapperboard, Flame } from "lucide-react";
import AnimeCard from "../components/AnimeCard";
import Pagination from "../components/Pagination";

export default function TopAnime() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const fetchParams = useMemo(() => {
    const params = { page: currentPage, limit: 24 };
    return params;
  }, [currentPage]);

  const {
    data: topAnimeList,
    loading,
    pagination,
  } = useFetchAnime("top/anime", fetchParams);

  return (
    <div className="min-h-screen px-4 md:px-12 lg:px-24 py-10 text-bright">
      {/* --- HERO / HEADER SECTION --- */}
      <div className="mb-12 text-center md:text-left md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight italic flex items-center justify-center md:justify-start gap-3">
            Top <span className="text-primary">Anime</span> Leaderboard
          </h1>
          <p className="text-muted text-sm mt-2">
            The highest-rated and most popular anime series of all time, updated
            globally.
          </p>
        </div>
      </div>

      {/* --- GRID CONTENT SECTION --- */}
      {loading ? (
        /* SKELETON LOADING STATE */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="w-full relative">
                <AnimeCard isLoading={true} />
              </div>
            ))}
        </div>
      ) : topAnimeList && topAnimeList.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
            {topAnimeList.map((anime, index) => {
              // Menghitung peringkat asli berdasarkan index dan halaman
              const globalRank =
                anime.rank || (currentPage - 1) * 24 + (index + 1);

              // Styling warna dinamis khusus untuk Top 3 besar
              const rankBadgeColor =
                globalRank === 1
                  ? "bg-yellow-500 text-black font-black"
                  : globalRank === 2
                    ? "bg-slate-300 text-black font-black"
                    : globalRank === 3
                      ? "bg-amber-600 text-white font-black"
                      : "bg-card/80 text-bright border border-white/10 backdrop-blur-md";

              return (
                <div key={anime.mal_id} className="relative w-full group">
                  <AnimeCard
                    anime={anime}
                    isLoading={false}
                    isTopAnime={true}
                    rank={globalRank}
                  />
                </div>
              );
            })}
          </div>

          {/* --- PAGINATION --- */}
          {pagination?.last_visible_page > 1 && (
            <div className="mt-16 justify-center flex items-center">
              <Pagination lastPage={pagination.last_visible_page} />
            </div>
          )}
        </>
      ) : (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">empty</div>
          <p className="text-muted mt-2">
            Try searching with different keywords.
          </p>
        </div>
      )}
    </div>
  );
}
