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

  const displayData = isLoading ? Array.from({ length: 5 }) : data;

  return (
    <>
      <div className="flex items-center align-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-bright">
          {title} <span className="text-primary">Anime</span>
        </h2>
        <button
          className="text-sm font-bold text-primary hover:underline transition-all"
          onClick={handleViewAll}
        >
          View All
        </button>
      </div>
      <div>
        <Swiper
          modules={[Autoplay, Navigation]}
          navigation={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          className="w-full !pb-4 px-12 custom-swiper-nav"
          spaceBetween={12}
          slidesPerView={1}
          breakpoints={{
            440: {
              slidesPerView: 2,
              spaceBetween: 12,
            },
            710: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 16,
            },
            1440: {
              slidesPerView: 6,
              spaceBetween: 20,
            },
          }}
        >
          {displayData?.map((anime, index) => (
            <SwiperSlide key={isLoading ? index : anime?.mal_id} className="flex justify-center">
              <AnimeCard anime={anime} isLoading={isLoading} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}