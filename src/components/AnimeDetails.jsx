import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Clock, Calendar, ChevronLeft, PlayCircle } from "lucide-react";

export default function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  const animeId = id || 21; 

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/full`);
        const json = await response.json();
        setAnime(json.data);

        return document.title = `${anime.title} | AnimeTV`
      } catch (error) {
        console.error("Gagal mengambil detail anime:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimeDetails();
  }, [animeId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!anime) return <div className="text-center py-20">Anime tidak ditemukan.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-8 group">
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <article className="flex flex-col md:flex-row gap-10 items-start mb-16">
        {/* Kolom Poster (Kiri) */}
        <div className="w-full md:w-1/3 md:sticky md:top-24">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <img src={anime.images.jpg.large_image_url} alt={anime.title} className="w-full h-auto object-cover" />
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-card p-4 rounded-xl border border-white/5 text-center shadow-lg">
              <Star className="mx-auto mb-1 text-yellow-400" size={20} fill="currentColor" />
              <p className="text-xl font-bold">{anime.score || "N/A"}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider font-bold">Score</p>
            </div>
            <div className="bg-card p-4 rounded-xl border border-white/5 text-center shadow-lg">
              <Clock className="mx-auto mb-1 text-primary" size={20} />
              <p className="text-sm font-bold truncate">{anime.duration.split(" per")[0]}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider font-bold">Duration</p>
            </div>
          </div>
        </div>

        {/* Kolom Detail (Kanan) */}
        <div className="flex-1 space-y-8">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {anime.genres.map((genre) => (
                <span key={genre.mal_id} className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-md border border-primary/20 uppercase tracking-tighter">
                  {genre.name}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-2 leading-tight uppercase italic">{anime.title}</h1>
            <h2 className="text-xl text-muted font-medium italic opacity-70">{anime.title_japanese}</h2>
          </div>

          {/* Sinopsis */}
          <div>
            <h3 className="text-xl font-bold mb-3 border-l-4 border-primary pl-4 uppercase tracking-wider">Synopsis</h3>
            <p className="text-muted leading-relaxed text-justify md:text-left text-sm md:text-base">
              {anime.synopsis || "No synopsis available for this title."}
            </p>
          </div>

          {/* --- VIDEO TRAILER SECTION --- */}
          {anime.trailer?.embed_url && (
            <div className="pt-4">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 uppercase tracking-wider">
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

          {/* Info Tambahan */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-white/5">
            <div className="space-y-1">
              <p className="text-[10px] text-muted uppercase font-bold tracking-widest">Studios</p>
              <p className="font-semibold text-sm">{anime.studios.map(s => s.name).join(", ") || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-muted uppercase font-bold tracking-widest">Source</p>
              <p className="font-semibold text-sm">{anime.source}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-muted uppercase font-bold tracking-widest">Episodes</p>
              <p className="font-semibold text-sm">{anime.episodes || "Ongoing"}</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}