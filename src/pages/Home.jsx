import { useState, useEffect } from "react";
import AnimeHeroList from "../components/AnimeHeroList.jsx";
import Carousel from "../components/Carousel";
import { useFetchAnime } from "../hook/useFetchAnime.jsx";
import AnimeCarousel from "../components/AnimeCarousel.jsx";

export default function Home() {
  const getUpcomingSeasonPath = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    let currentYear = now.getFullYear();
    let upcomingSeason = "";

    if (currentMonth >= 0 && currentMonth <= 2) {
      upcomingSeason = "spring";
    } else if (currentMonth >= 3 && currentMonth <= 5) {
      upcomingSeason = "summer";
    } else if (currentMonth >= 6 && currentMonth <= 8) {
      upcomingSeason = "fall";
    } else {
      upcomingSeason = "winter";
      currentYear += 1;
    }

    return `/anime/season/${currentYear}/${upcomingSeason}`;
  };

  const { data: carouselAnime, loading: loadingTop } = useFetchAnime(
    "top/anime",
    { limit: 5 },
  );
  const { data: seasonalAnime, loading: seasonalAnimeLoading } = useFetchAnime(
    "seasons/now",
    { limit: 12 },
  );
  const { data: upComingAnime, loading: upComingAnimeLoading } = useFetchAnime(
    "seasons/upcoming",
    { limit: 12 },
  );

  return (
    <div className="min-h-screen bg-background text-bright font-sans">
      <Carousel data={carouselAnime} isLoading={loadingTop} />

      <main className="max-w-auto mx-auto px-6 md:px-16 xl:px-20 py-10 space-y-10">
        <AnimeCarousel
          data={seasonalAnime}
          title={"This Season's"}
          path="/anime/season/now"
          isLoading={seasonalAnimeLoading}
        />
        <AnimeCarousel
          data={upComingAnime}
          title={"Upcoming"}
          isLoading={upComingAnimeLoading}
          path={getUpcomingSeasonPath()}
        />
      </main>
    </div>
  );
}
