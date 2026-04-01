import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Clock, Calendar, ChevronLeft, PlayCircle } from "lucide-react";
import { useFetchAnime } from "../hook/useFetchAnime";

export default function AnimeDetails() {
  const { id } = useParams();
  const animeId = id || 21; 
  // Hook useFetchAnime sudah menangani ?sfw secara global
  const { data: anime, loading: animeDetailLoading } = useFetchAnime(`anime/${animeId}/full`);
  const navigate = useNavigate();

  const handleGenreList = (genreId, genreName) => {
    navigate(`/anime/genre/${genreId}/${genreName.toLowerCase()}`);
  };

  useEffect(() => {
    if (anime?.title) {
      document.title = `${anime.title} | AnimeTV`;
    }
    return () => { document.title = "AnimeTV"; };
  }, [anime]);

  if (animeDetailLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!anime) return <div className="text-center py-20 text-muted font-bold uppercase">Anime Not Found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-8 group font-bold uppercase text-xs tracking-widest">
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

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
              <Star className="mx-auto mb-1 text-yellow-400" size={20} fill="currentColor" />
              <p className="text-xl font-bold">{anime.score || "N/A"}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider font-bold">Score</p>
            </div>
            <div className="bg-card p-4 rounded-xl border border-white/5 text-center shadow-lg">
              <Clock className="mx-auto mb-1 text-primary" size={20} />
              <p className="text-sm font-bold truncate">{anime.duration?.split(" per")[0] || "N/A"}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider font-bold">Duration</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1 p-4 bg-white/5 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-primary">
               <Calendar size={16} />
               <p className="text-xs font-black uppercase tracking-widest">Aired Information</p>
            </div>
            <p className="text-sm font-medium">
              <span className="text-muted">Status:</span> {anime.status}
            </p>
            {!anime.airing && (
               <p className="text-sm font-medium">
                 <span className="text-muted">Aired:</span> {anime.aired?.string || "Unknown"}
               </p>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Tampilkan semua genre yang dikirim oleh API (sudah difilter SFW dari server) */}
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
            <h1 className="text-4xl md:text-5xl font-black mb-2 leading-tight uppercase italic text-bright">{anime.title}</h1>
            <h2 className="text-xl text-muted font-medium italic opacity-70">{anime.title_japanese}</h2>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold border-l-4 border-primary pl-4 uppercase tracking-wider">Synopsis</h3>
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
              <p className="text-[10px] text-muted uppercase font-bold tracking-widest">Studios</p>
              <p className="font-semibold text-sm">{anime.studios?.map(s => s.name).join(", ") || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-muted uppercase font-bold tracking-widest">Source</p>
              <p className="font-semibold text-sm">{anime.source || "-"}</p>
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