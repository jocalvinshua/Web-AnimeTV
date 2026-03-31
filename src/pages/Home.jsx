import { useState, useEffect } from "react";
import AnimeHeroList from "../components/AnimeHeroList.jsx";
import Carousel from "../components/Carousel";
import { useFetchAnime } from "../hook/useFetchAnime.jsx";

export default function Home() {
  // fetching Carousel Data
  const {data: carouselAnime, loading: loadingTop} = useFetchAnime('top/anime',{limit: 5})

  // fetching Season Anime
  const {data: seasonalAnime, loading: seasonalAnimeLoading} = useFetchAnime('seasons/now', {limit: 12}, 1500)


  return (
    <div className="min-h-screen bg-background text-bright font-sans">
      <Carousel data={carouselAnime} isLoading={loadingTop} />

      <main className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-10">
        <AnimeHeroList 
          title="This Season's" 
          data={seasonalAnime}
          isLoading={seasonalAnimeLoading} 
        />
      </main>
    </div>
  );
}