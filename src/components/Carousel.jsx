import { useState, useEffect, useCallback } from 'react';

// Menerima data dan isLoading dari Home.jsx
const Carousel = ({ data = [], isLoading }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Formatting data dari API ke struktur slide
  const slides = data.map(anime => ({
    title: anime.title,
    genres: anime.genres?.map(g => g.name) || [],
    description: anime.synopsis,
    image: anime.images?.jpg?.large_image_url,
    id: anime.mal_id
  }));

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    if (totalSlides > 0) {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }
  }, [totalSlides]);

  const prevSlide = () => {
    if (totalSlides > 0) {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  // Auto-slide logic
  useEffect(() => {
    if (totalSlides > 0 && !isLoading) {
      const slideInterval = setInterval(nextSlide, 6000);
      return () => clearInterval(slideInterval);
    }
  }, [nextSlide, currentSlide, totalSlides, isLoading]);

  // Loading State (Skeleton)
  if (isLoading) return (
    <div className="flex items-center justify-center w-full min-h-[400px] p-4 mb-12">
      <div className="w-full max-w-5xl aspect-video md:aspect-[21/9] bg-gray-800/50 animate-pulse rounded-3xl" />
    </div>
  );

  if (slides.length === 0) return null;

  return (
    <div className="flex items-center justify-center w-full min-h-[400px] p-4 bg-transparent mb-12 relative">
      {/* Tombol Kiri */}
      <button onClick={prevSlide} className="z-10 md:p-3 p-2 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full transition-all shrink-0 border border-white/10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Container Utama */}
      <div className="w-full max-w-5xl overflow-hidden relative rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] mx-4 aspect-video md:aspect-[21/9] bg-gray-950">
        <div 
          className="flex h-full transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="w-full h-full flex-shrink-0 relative group">
              <img src={slide.image} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110" alt={slide.title} />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />

              <div className="relative h-full flex flex-col justify-center px-8 md:px-16 w-full md:w-3/4 lg:w-2/3 space-y-4 text-white">
                <div className="flex flex-wrap gap-2">
                  {slide.genres.slice(0, 3).map((genre) => (
                    <span key={genre} className="bg-primary/20 backdrop-blur-md text-primary-light px-3 py-1 text-[10px] md:text-xs font-bold rounded-full border border-primary/30 uppercase tracking-widest">
                      {genre}
                    </span>
                  ))}
                </div>

                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight drop-shadow-2xl line-clamp-2 uppercase">
                  {slide.title}
                </h2>

                <p className="text-xs md:text-base text-gray-300 line-clamp-3 font-medium max-w-lg leading-relaxed opacity-80">
                  {slide.description}
                </p>

                <div className="flex items-center pt-4">
                  <button className="flex items-center group/btn shadow-xl active:scale-95 transition-transform">
                    <span className="bg-primary hover:bg-primary-dark text-white px-6 py-3 font-black text-xs md:text-sm tracking-widest uppercase transition-colors rounded-l-xl">
                      Lihat Detail
                    </span>
                    <span className="bg-primary-dark p-3 md:p-3.5 rounded-r-xl transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigator Dots */}
        <div className="absolute bottom-6 left-1/2 md:left-auto md:right-12 -translate-x-1/2 md:translate-x-0 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 transition-all duration-500 rounded-full ${currentSlide === index ? 'bg-primary w-10' : 'bg-white/20 w-3 hover:bg-white/40'}`}
            />
          ))}
        </div>
      </div>

      {/* Tombol Kanan */}
      <button onClick={nextSlide} className="z-10 md:p-3 p-2 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full transition-all shrink-0 border border-white/10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Carousel;