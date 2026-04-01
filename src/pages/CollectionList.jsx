import { useNavigate } from "react-router-dom";
import { useFetchAnime } from "../hook/useFetchAnime";
import { Folder, CalendarDays } from "lucide-react";

export default function CollectionList({ type }) {
  const navigate = useNavigate();

  const endpoint = type === "genres" ? "genres/anime" : "seasons";
  const { data: tagList, loading } = useFetchAnime(endpoint);

  const handleNavigation = (item, seasonName = null) => {
    if (type === "genres") {
      navigate(`/anime/genre/${item.mal_id}/${item.name.toLowerCase()}`);
    } else {
      navigate(`/anime/season/${item.year}/${seasonName.toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen px-4 md:px-12 lg:px-24 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 border-l-4 border-primary pl-6">
          <h1 className="text-4xl font-black uppercase italic text-bright tracking-tighter">
            {type === "genres" ? "Browse by Genre" : "Season Archives"}
          </h1>
          <p className="text-muted text-sm mt-2 font-medium uppercase tracking-widest opacity-60">
            {type === "genres" ? "Find anime by category" : "Explore anime by release year"}
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-24 bg-card/40 animate-pulse rounded-2xl border border-white/5"></div>
            ))
          ) : type === "genres" ? (
            // RENDER GENRES
            tagList.map((genre) => (
              <div
                key={genre.mal_id}
                onClick={() => handleNavigation(genre)}
                className="group bg-card border border-white/5 p-6 rounded-2xl hover:border-primary/50 transition-all cursor-pointer flex items-center gap-4 shadow-xl"
              >
                <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-main transition-colors">
                  <Folder size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-bright group-hover:text-primary transition-colors">{genre.name}</h3>
                  <p className="text-[10px] text-muted uppercase font-black opacity-50">{genre.count} Titles</p>
                </div>
              </div>
            ))
          ) : (
            // RENDER SEASONS (ARCHIVE)
            tagList.map((yearItem) => (
              <div key={yearItem.year} className="bg-card border border-white/5 p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3 mb-4 text-primary">
                  <CalendarDays size={20} />
                  <h3 className="text-xl font-black italic">{yearItem.year}</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {yearItem.seasons.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleNavigation(yearItem, s)}
                      className="text-[10px] font-black uppercase tracking-tighter py-2 px-3 bg-white/5 hover:bg-primary hover:text-main rounded-lg transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}