import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  PlayCircle,
  Heart,
  ArrowRight,
  Link2,
  Award,
  Star,
} from "lucide-react";
import { useFetchAnime } from "../hook/useFetchAnime";

// Extract YouTube video ID from embed URL
function getYtThumbnail(embedUrl) {
  if (!embedUrl) return null;
  const match = embedUrl.match(/(?:embed\/|v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match
    ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`
    : null;
}

export default function AnimeDetails() {
  const [isFavorite, setIsFavorite] = useState(false);
  const { id } = useParams();
  const animeId = id ? Number(id) : 21;
  const { data: anime, loading: animeDetailLoading } = useFetchAnime(
    `anime/${animeId}/full`,
  );
  const navigate = useNavigate();

  const thumbnailUrl = getYtThumbnail(anime?.trailer?.embed_url);

  const handleGenreList = (genreId, genreName) => {
    navigate(`/anime/genre/${genreId}/${genreName.toLowerCase()}`);
  };

  const checkFavoriteStatus = useCallback(() => {
    const localData = localStorage.getItem("Anime-Favorites");
    if (localData) {
      const favoritesList = JSON.parse(localData);
      setIsFavorite(favoritesList.some((item) => item.id === animeId));
    } else {
      setIsFavorite(false);
    }
  }, [animeId]);

  const handleFavorite = () => {
    if (!anime) return;
    const localData = localStorage.getItem("Anime-Favorites");
    const favoritesList = localData ? JSON.parse(localData) : [];
    const newFavorite = {
      id: animeId,
      title: anime.title,
      image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
      score: anime.score,
    };
    if (!favoritesList.some((item) => item.id === animeId)) {
      localStorage.setItem(
        "Anime-Favorites",
        JSON.stringify([...favoritesList, newFavorite]),
      );
      setIsFavorite(true);
    }
  };

  const handleUnfavorite = () => {
    const localData = localStorage.getItem("Anime-Favorites");
    if (localData) {
      const updated = JSON.parse(localData).filter(
        (item) => item.id !== animeId,
      );
      localStorage.setItem("Anime-Favorites", JSON.stringify(updated));
      setIsFavorite(false);
    }
  };

  const handleTitle = useCallback(() => {
    if (anime?.title) document.title = `${anime.title} | AnimeTV`;
    return () => {
      document.title = "AnimeTV";
    };
  }, [anime]);

  useEffect(() => {
    handleTitle();
    checkFavoriteStatus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [handleTitle, checkFavoriteStatus, id]);

  // Debugging
  // useEffect(() => {
  //   console.log("Anime data:", anime.aired);
  // }, [anime]);

  if (animeDetailLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!anime)
    return (
      <div className="text-center py-20 text-muted font-bold uppercase">
        Anime Not Found.
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-bright">
      {/* ── BANNER ── */}
      <div className="relative w-full h-[320px] md:h-[520px] overflow-hidden mx-auto">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${thumbnailUrl || anime.images?.jpg?.large_image_url})`,
          }}
        />

        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-4 md:left-8 z-20 inline-flex items-center gap-1.5 bg-black/60 border border-white/10 text-white/80 hover:text-primary text-xs font-bold px-3 py-2 rounded-lg transition-colors group"
        >
          <ChevronLeft
            size={14}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Back
        </button>

        {/* Banner content */}
        <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto flex items-end gap-6 px-4 md:px-8 pb-8 z-10">
          {/* Poster */}
          <div className="hidden sm:block flex-shrink-0 w-[130px] h-[185px] rounded-xl overflow-hidden border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
            <img
              src={anime.images?.jpg?.large_image_url}
              alt={anime.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {anime.rank && (
                <span className="text-[11px] font-black tracking-wider uppercase px-3 py-0.5 rounded-md bg-primary text-background flex items-center gap-1 shadow-lg shadow-primary/20">
                  <Award size={12} /> #{anime.rank} Ranking
                </span>
              )}
              <span className="text-[11px] font-bold px-3 py-0.5 rounded-md bg-white/10 border border-white/15 text-white">
                {anime.type || "TV"}
              </span>
              {anime.airing && (
                <span className="text-[11px] font-bold px-3 py-0.5 rounded-md bg-green-500/20 border border-green-500/30 text-green-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                  Airing
                </span>
              )}
            </div>

            {/* Titles */}
            <div className="space-y-1">
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight drop-shadow-md">
                {anime.title}
              </h1>
              <p className="text-xs md:text-sm text-white/60 font-medium italic">
                {anime.title_english || anime.title_japanese}
              </p>
            </div>

            <div className="flex items-center gap-0 text-xs text-white/60 flex-wrap">
              <span className="flex items-center gap-1 text-yellow-400 font-bold mr-1">
                <Star size={12} fill="currentColor" /> {anime.score}
              </span>
              <span className="text-white/25 text-[10px] mr-3">/10</span>
              <span>{anime.studios?.map((s) => s.name).join(", ") || "—"}</span>
              <span className="mx-2 text-white/20">|</span>
              <span>{anime.year || new Date().getFullYear()}</span>
              <span className="mx-2 text-white/20">|</span>
              <span>
                {anime.episodes ? `${anime.episodes} episodes` : "Ongoing"}
              </span>
            </div>

            {/* Genres */}
            <div className="flex gap-1.5 flex-wrap">
              {anime.genres?.map((genre) => (
                <span
                  key={genre.mal_id}
                  onClick={() => handleGenreList(genre.mal_id, genre.name)}
                  className="text-[10px] font-black uppercase tracking-wider text-primary border border-white/10 px-3 py-1 rounded-md bg-white/5 cursor-pointer"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={isFavorite ? handleUnfavorite : handleFavorite}
                className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-2 rounded-lg transition-all ${
                  isFavorite
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                    : "bg-white/10 hover:bg-white/20 border border-white/10 text-white"
                }`}
              >
                <Heart size={13} fill={isFavorite ? "currentColor" : "none"} />
                {isFavorite ? "Favorited" : "Add to Favorites"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY SPLIT LAYOUT ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            {/* Synopsis */}
            <div className="space-y-3">
              <h3 className="text-xl font-black border-l-4 border-primary pl-4 uppercase tracking-wider text-white">
                Synopsis
              </h3>
              <p className="text-muted leading-relaxed text-justify md:text-left text-sm md:text-base italic bg-card/20 p-5 rounded-2xl border border-white/[0.02]">
                {anime.synopsis || "No synopsis available for this title."}
              </p>
            </div>

            {/* Trailer */}
            {anime.trailer?.embed_url && (
              <div className="space-y-4">
                <h3 className="text-xl font-black flex items-center gap-2 uppercase tracking-wider text-white">
                  <PlayCircle className="text-primary" /> Official Trailer
                </h3>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                  <iframe
                    src={anime.trailer.embed_url}
                    title="Anime Trailer"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Relations */}
            {anime.relations?.length > 0 && (
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                  <Link2 className="text-primary" size={22} />
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
                    Anime <span className="text-primary">Relations</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {anime.relations.flatMap((group) =>
                    group.entry?.map((item) => {
                      const isAnime = item.type === "anime";
                      return (
                        <div
                          key={item.mal_id}
                          onClick={() =>
                            isAnime && navigate(`/anime-details/${item.mal_id}`)
                          }
                          className={`flex items-center justify-between p-3 bg-card/40 border border-white/5 rounded-xl transition-all duration-300 group h-[76px] ${
                            isAnime
                              ? "cursor-pointer hover:border-primary/30 hover:ring-1 hover:bg-card hover:ring-primary/20"
                              : "opacity-60 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex flex-col gap-0.5 min-w-0 flex-1 pr-2">
                            <span className="text-[9px] font-black uppercase tracking-wider text-primary/80 block truncate">
                              {group.relation}
                            </span>
                            <h4 className="text-white font-bold text-xs truncate transition-colors">
                              {item.name}
                            </h4>
                            <span className="text-[9px] text-muted font-bold uppercase tracking-wider block">
                              {item.type}
                            </span>
                          </div>
                          {isAnime && (
                            <ArrowRight
                              size={14}
                              className="text-muted group-hover:text-primary transform group-hover:translate-x-1 transition-all shrink-0"
                            />
                          )}
                        </div>
                      );
                    }),
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-4 space-y-6">
            {/* Info Block (Tanpa Ikon) */}
            <div className="p-5 bg-card/40 backdrop-blur-sm border border-white/5 rounded-2xl shadow-xl space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-white border-b border-white/5 pb-2">
                Information
              </h3>

              <div className="divide-y divide-white/5 text-sm">
                {[
                  { label: "Type", value: anime.type },
                  { label: "Status", value: anime.status },
                  { label: "Source", value: anime.source },
                  { label: "Aired", value: anime.aired?.string },
                  {
                    label: "Studio",
                    value: anime.studios?.map((s) => s.name).join(", "),
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 py-2"
                  >
                    <p className="text-[10px] text-muted font-black uppercase tracking-widest flex-shrink-0">
                      {label}
                    </p>
                    <p
                      className="font-bold text-bright text-right truncate"
                      title={value}
                    >
                      {value || "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Theme Songs Block */}
            {/* Theme Songs Block */}
            {((anime.theme?.openings && anime.theme.openings.length > 0) ||
              (anime.theme?.endings && anime.theme.endings.length > 0)) && (
              <div className="space-y-4 p-5 bg-card/20 border border-white/[0.02] rounded-2xl">
                <h3 className="text-sm font-black uppercase tracking-wider text-white border-b border-white/5 pb-2">
                  Theme Songs
                </h3>

                {/* Openings */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-primary">
                    Opening Themes
                  </h4>
                  {anime.theme?.openings && anime.theme.openings.length > 0 ? (
                    <ul className="space-y-2 text-xs text-muted list-none">
                      {anime.theme.openings.map((op, idx) => {
                        const searchQuery = encodeURIComponent(
                          op.replace(/^\d+:\s*/, "") + " " + anime.title,
                        );
                        return (
                          <li
                            key={idx}
                            className="flex gap-2 items-start group"
                          >
                            <span className="font-bold text-primary/80 shrink-0">
                              {idx + 1}.
                            </span>
                            <a
                              href={`https://www.youtube.com/results?search_query=${searchQuery}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="leading-normal hover:text-primary hover:underline transition-colors cursor-pointer"
                              title="Cari di YouTube"
                            >
                              {op}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted/50 italic">
                      No opening themes listed.
                    </p>
                  )}
                </div>

                {/* Endings */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-primary">
                    Ending Themes
                  </h4>
                  {anime.theme?.endings && anime.theme.endings.length > 0 ? (
                    <ul className="space-y-2 text-xs text-muted list-none">
                      {anime.theme.endings.map((ed, idx) => {
                        const searchQuery = encodeURIComponent(
                          ed.replace(/^\d+:\s*/, "") + " " + anime.title,
                        );
                        return (
                          <li
                            key={idx}
                            className="flex gap-2 items-start group"
                          >
                            <span className="font-bold text-primary shrink-0">
                              {idx + 1}.
                            </span>
                            <a
                              href={`https://www.youtube.com/results?search_query=${searchQuery}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="leading-normal hover:text-primary hover:underline transition-colors cursor-pointer"
                              title="Cari di YouTube"
                            >
                              {ed}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-xs text-muted/50 italic">
                      No ending themes listed.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
