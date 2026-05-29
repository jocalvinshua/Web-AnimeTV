import { useCallback, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  Calendar,
  ChevronLeft,
  PlayCircle,
  Heart,
  ArrowRight,
  Link2,
} from "lucide-react";
import { useFetchAnime } from "../hook/useFetchAnime";

export default function AnimeDetails() {
  const [isFavorite, setIsFavorite] = useState(false);
  const { id } = useParams();
  const animeId = id ? Number(id) : 21;
  const { data: anime, loading: animeDetailLoading } = useFetchAnime(
    `anime/${animeId}/full`,
  );
  const navigate = useNavigate();

  const handleGenreList = (genreId, genreName) => {
    navigate(`/anime/genre/${genreId}/${genreName.toLowerCase()}`);
  };

  const checkFavoriteStatus = useCallback(() => {
    const localData = localStorage.getItem("Anime-Favorites");
    if (localData) {
      const favoritesList = JSON.parse(localData);
      const exists = favoritesList.some((item) => item.id === animeId);
      setIsFavorite(exists);
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

    // Mencegah duplikasi data sebelum push
    if (!favoritesList.some((item) => item.id === animeId)) {
      const updatedList = [...favoritesList, newFavorite];
      localStorage.setItem("Anime-Favorites", JSON.stringify(updatedList));
      setIsFavorite(true);
    }
  };
  const handleUnfavorite = () => {
    const localData = localStorage.getItem("Anime-Favorites");
    if (localData) {
      const favoritesList = JSON.parse(localData);
      const updatedList = favoritesList.filter((item) => item.id !== animeId);
      localStorage.setItem("Anime-Favorites", JSON.stringify(updatedList));
      setIsFavorite(false);
    }
  };

  const handleTitle = useCallback(() => {
    if (anime?.title) {
      document.title = `${anime.title} | AnimeTV`;
    }
    return () => {
      document.title = "AnimeTV";
    };
  }, [anime]);

  useEffect(() => {
    handleTitle();
    checkFavoriteStatus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [handleTitle, checkFavoriteStatus, id]);

  // Debugging
  // useEffect(()=>{
  //   console.log(anime.theme)
  // },[anime])

  if (animeDetailLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!anime)
    return (
      <div className="text-center py-20 text-muted font-bold uppercase">
        Anime Not Found.
      </div>
    );

  if (!anime?.relations || anime.relations.length === 0) {
    return (
      <div className="mt-10 bg-card/30 border border-white/5 rounded-2xl p-6 text-center text-muted text-sm">
        No relations available for this anime.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-8 group font-bold uppercase text-xs tracking-widest"
      >
        <ChevronLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back
      </button>

      <article className="flex flex-col md:flex-row gap-10 items-start mb-16">
        <div className="w-full md:w-1/3 md:sticky md:top-24">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
            <img
              src={anime.images?.jpg?.large_image_url}
              alt={anime.title}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-card p-4 rounded-xl border border-white/5 text-center shadow-lg">
              <Star
                className="mx-auto mb-1 text-yellow-400"
                size={20}
                fill="currentColor"
              />
              <p className="text-xl font-bold">{anime.score || "N/A"}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider font-bold">
                Score
              </p>
            </div>
            <div className="bg-card p-4 rounded-xl border border-white/5 text-center shadow-lg">
              <Clock className="mx-auto mb-1 text-primary" size={20} />
              <p className="text-sm font-bold truncate">
                {anime.duration?.split(" per")[0] || "N/A"}
              </p>
              <p className="text-[10px] text-muted uppercase tracking-wider font-bold">
                Duration
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-card/40 rounded-xl border border-white/5 space-y-2.5">
            <div className="flex items-center gap-2 text-primary border-b border-white/5 pb-1.5">
              <Calendar size={14} />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Aired Information
              </p>
            </div>
            <div className="space-y-1 text-xs">
              <p className="font-medium text-bright/90">
                <span className="text-muted mr-1">Status:</span> {anime.status}
              </p>
              <p className="font-medium text-bright/90">
                <span className="text-muted mr-1">Aired:</span>{" "}
                {anime.aired?.string || "Unknown"}
              </p>
            </div>
          </div>

          <button
            onClick={isFavorite ? handleUnfavorite : handleFavorite}
            className={`mt-4 flex items-center justify-center gap-2 w-full font-black text-sm py-3 rounded-xl shadow-lg transition-all active:scale-[0.98] ${
              isFavorite
                ? "bg-card text-primary border border-primary/30 hover:bg-primary/10 shadow-black/20"
                : "bg-primary hover:bg-primary/95 text-background shadow-primary/10"
            }`}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>

        <div className="flex-1 space-y-8">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {anime.genres?.map((genre) => (
                <span
                  key={genre.mal_id}
                  onClick={() => handleGenreList(genre.mal_id, genre.name)}
                  className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-md border border-primary/20 uppercase tracking-tighter cursor-pointer hover:bg-primary hover:text-main transition-colors"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-2 leading-tight uppercase italic text-bright">
              {anime.title}
            </h1>
            <h2 className="text-xl text-muted font-medium italic opacity-70">
              {anime.title_japanese}
            </h2>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold border-l-4 border-primary pl-4 uppercase tracking-wider">
              Synopsis
            </h3>
            <p className="text-muted leading-relaxed text-justify md:text-left text-sm md:text-base italic">
              {anime.synopsis || "No synopsis available for this title."}
            </p>
          </div>

          {anime.trailer?.embed_url && (
            <div className="pt-4 space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 uppercase tracking-wider">
                <PlayCircle className="text-primary" /> Official Trailer
              </h3>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                <iframe
                  src={anime.trailer.embed_url}
                  title="Anime Trailer"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-white/5">
            <div className="space-y-1">
              <p className="text-[10px] text-muted uppercase font-bold tracking-widest">
                Studios
              </p>
              <p className="font-semibold text-sm">
                {anime.studios?.map((s) => s.name).join(", ") || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-muted uppercase font-bold tracking-widest">
                Source
              </p>
              <p className="font-semibold text-sm">{anime.source || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-muted uppercase font-bold tracking-widest">
                Episodes
              </p>
              <p className="font-semibold text-sm">
                {anime.episodes || "Ongoing"}
              </p>
            </div>
          </div>
        </div>
      </article>

      <div className="space-y-6 mt-10">
        {/* Header Section */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
          <Link2 className="text-primary" size={22} />
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-bright">
            Anime <span className="text-primary">Relations</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {anime.relations.flatMap((relationGroup) =>
            relationGroup.entry?.map((item) => {
              const isAnime = item.type === "anime";

              return (
                <div
                  key={item.mal_id}
                  onClick={() =>
                    isAnime && navigate(`/anime-details/${item.mal_id}`)
                  }
                  className={`flex items-center justify-between p-3 bg-card/40 hover:bg-card border border-white/5 rounded-xl transition-all duration-300 group h-[76px] ${
                    isAnime
                      ? "cursor-pointer hover:border-primary/30 hover:ring-1 hover:ring-primary/20"
                      : "opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1 pr-2">
                    <span className="text-[9px] font-black uppercase tracking-wider text-primary/80 block truncate">
                      {relationGroup.relation}
                    </span>
                    <h4 className="text-bright font-bold text-xs truncate group-hover:text-primary transition-colors">
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
    </div>
  );
}
