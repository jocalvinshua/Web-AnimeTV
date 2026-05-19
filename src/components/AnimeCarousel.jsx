import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import AnimeCard from "./AnimeCard";

import "swiper/css";
import "swiper/css/navigation";

export default function AnimeCarousel({ data, title, path = "/", isLoading }) {
  const navigate = useNavigate();
  const handleViewAll = () => {
    navigate(path);
  };

  const displayData = isLoading ? Array.from({ length: 6 }) : data;

  return (
    <div className="w-full mb-12">
      {/* Header Slider */}
      <div className="flex items-center justify-between mb-6 px-1 sm:px-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-bright">
          {title} <span className="text-primary">Anime</span>
        </h2>
        <button
          className="text-xs sm:text-sm font-bold text-primary hover:text-primary-dark hover:underline transition-all uppercase tracking-wider"
          onClick={handleViewAll}
        >
          View All
        </button>
      </div>

      {/* Swiper Container Wrapper */}
      <div className="relative w-full group/swiper sm:gap-2">
        <Swiper
          modules={[Autoplay, Navigation]}
          navigation={true}
          autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          className="w-full !pb-4 custom-swiper-nav rounded-xl"
          spaceBetween={12}
          slidesPerView={2} 
          breakpoints={{
            480: {
              slidesPerView: 2.5, 
              spaceBetween: 12,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
            1536: {
              slidesPerView: 6,
              spaceBetween: 20,
            },
          }}
        >
          {displayData?.map((anime, index) => (
            <SwiperSlide key={isLoading ? index : anime?.mal_id} className="h-auto">
              <AnimeCard anime={anime} isLoading={isLoading} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}