import { useState, useEffect } from "react";
import AnimeHeroList from "../components/AnimeHeroList.jsx";
import Carousel from "../components/Carousel";

export default function Home() {
  const [carouselData, setCarouselData] = useState([]);
  const [seasonalAnime, setSeasonalAnime] = useState([]);
  const [isCarouselLoading, setIsCarouselLoading] = useState(true);
  const [isSeasonalLoading, setIsSeasonalLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      // 1. Ambil data untuk Carousel terlebih dahulu (Prioritas Atas)
      try {
        const carouselRes = await fetch("https://api.jikan.moe/v4/top/anime?limit=5");
        const carouselJson = await carouselRes.json();
        setCarouselData(carouselJson.data || []);
      } catch (err) {
        console.error("Carousel fetch error:", err);
      } finally {
        setIsCarouselLoading(false);
      }

      // 2. JEDA ANTARA: Beri waktu 1.5 detik agar Jikan tidak mendeteksi spam
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 3. Ambil data untuk Seasonal List (Prioritas Kedua)
      try {
        const seasonalRes = await fetch("https://api.jikan.moe/v4/seasons/now?limit=20");
        const seasonalJson = await seasonalRes.json();
        setSeasonalAnime(seasonalJson.data || []);
      } catch (err) {
        console.error("Seasonal fetch error:", err);
      } finally {
        setIsSeasonalLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="min-h-screen bg-background text-bright font-sans">
      {/* Kirim data dan status loading ke Carousel */}
      <Carousel data={carouselData} isLoading={isCarouselLoading} />

      <main className="max-w-[1440px] mx-auto px-6 md:px-16 xl:px-20 py-10">
        <AnimeHeroList 
          title="This Season's" 
          data={seasonalAnime}
          isLoading={isSeasonalLoading} 
        />
      </main>
    </div>
  );
}