import { useNavigate } from "react-router-dom";
import AnimeCard from "../components/AnimeCard";

export default function AnimeHeroList({ title, data, isLoading }) {
  // Jika loading, tampilkan 4 skeleton card
  const displayData = isLoading ? Array.from({ length: 4 }) : data;
  const navigate = useNavigate()

  const handleViewAll =()=>{
    navigate('/anime/season/now')
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          {title} <span className="text-primary">Anime</span>
        </h2>
        <button className="text-sm font-bold text-primary hover:underline" onClick={handleViewAll}>View All</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 justify-items-center lg:justify-items-start">
        {displayData.map((anime, index) => (
          <AnimeCard 
            key={isLoading ? index : anime.mal_id} 
            anime={anime} 
            isLoading={isLoading} 
          />
        ))}
      </div>
    </section>
  );
}