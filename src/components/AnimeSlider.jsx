import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import AnimeCard from "./AnimeCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AnimeSlider({ data, title, path = "/", isLoading }) {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const displayData = isLoading ? Array.from({ length: 6 }) : data;

  const SCROLL_AMOUNT = 500;

  const updateButtons = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons);
    updateButtons();
    return () => el.removeEventListener("scroll", updateButtons);
  }, [displayData]);

  const scrollLeft = () =>
    trackRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });

  const scrollRight = () =>
    trackRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });

  // Drag-to-scroll handlers
  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX;
    scrollStart.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = "grabbing";
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    trackRef.current.scrollLeft =
      scrollStart.current - (e.pageX - startX.current);
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  };

  return (
    <div className="w-full mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-1 sm:px-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-bright">
          {title} <span className="text-primary">Anime</span>
        </h2>
        <button
          className="text-xs sm:text-sm font-bold text-primary hover:text-primary-dark hover:underline transition-all uppercase tracking-wider"
          onClick={() => navigate(path)}
        >
          View All
        </button>
      </div>

      {/* Slider */}
      <div className="relative group/swiper">
        {/* Prev Button */}
        <button
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full
            bg-primary text-white flex items-center justify-center shadow-lg
            opacity-0 group-hover/swiper:opacity-100 transition-opacity
            disabled:opacity-20 disabled:pointer-events-none"
        >
          <ChevronLeft />
        </button>

        {/* Track Outer (edge fade mask) */}
        <div
          className="overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 40px, black calc(100% - 40px), transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 40px, black calc(100% - 40px), transparent 100%)",
          }}
        >
          {/* Scrollable Track */}
          <div
            ref={trackRef}
            className="flex gap-3 overflow-x-auto scroll-smooth px-10 py-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              cursor: "grab",
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {displayData?.map((anime, index) => (
              <div
                key={`${title.toLowerCase().replace(/\s+/g, "-")}-${anime?.mal_id ?? index}-${index}`}
                className="flex-shrink-0 flex flex-col gap-3 overflow-hidden"
              >
                <AnimeCard anime={anime} />
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={scrollRight}
          disabled={!canScrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full
            bg-primary text-white flex items-center justify-center shadow-lg
            opacity-0 group-hover/swiper:opacity-100 transition-opacity
            disabled:opacity-20 disabled:pointer-events-none"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
