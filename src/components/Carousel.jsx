import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const Carousel = ({ data = [], isLoading }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // State untuk melacak posisi touch (Mobile Swipe)
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

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

  // Logic untuk pendeteksi Swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  useEffect(() => {
    if (totalSlides > 0 && !isLoading) {
      const slideInterval = setInterval(nextSlide, 6000);
      return () => clearInterval(slideInterval);
    }
  }, [nextSlide, currentSlide, totalSlides, isLoading]);

  // Skeleton Loader Responsif
  if (isLoading) return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-12">
      <div className="w-full aspect-[4/5] sm:aspect-video md:aspect-[21/9] bg-gray-800/50 animate-pulse rounded-3xl" />
    </div>
  );

  if (slides.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-12 relative group/container">
      
      {/* Container Utama dengan Aspek Rasio Dinamis */}
      <div 
        className="w-full overflow-hidden relative rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] aspect-[4/5] sm:aspect-[16/10] md:aspect-[21/9] bg-gray-950"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex h-full transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="w-full h-full flex-shrink-0 relative group">
              
              {/* Gambar Background */}
              <img 
                src={slide.image} 
                className="absolute inset-0 w-full h-full object-cover opacity-50 sm:opacity-60 transition-transform duration-1000 group-hover:scale-105" 
                alt={slide.title} 
              />
              
              {/* Overlay Gradien Gradual: Vertikal di mobile, Horizontal di desktop */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20 sm:bg-gradient-to-r sm:from-black sm:via-black/50 sm:to-transparent" />

              {/* Konten Teks diatur flex-end pada mobile agar tidak menutupi wajah karakter */}
              <div className="absolute inset-0 flex flex-col justify-end sm:justify-center p-6 sm:px-12 md:px-16 w-full sm:w-5/6 md:w-3/4 lg:w-2/3 space-y-3 sm:space-y-4 text-white pb-14 sm:pb-6">
                
                {/* Genre */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {slide.genres.slice(0, 3).map((genre) => (
                    <span key={genre} className="bg-primary/20 backdrop-blur-md text-primary-light px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-xs font-bold rounded-full border border-primary/30 uppercase tracking-widest">
                      {genre}
                    </span>
                  ))}
                </div>

                {/* Judul Anime */}
                <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight drop-shadow-2xl line-clamp-2 uppercase tracking-tight">
                  {slide.title}
                </h2>

                {/* Deskripsi */}
                <p className="text-[11px] sm:text-xs md:text-sm lg:text-base text-gray-300 line-clamp-2 sm:line-clamp-3 font-medium max-w-lg leading-relaxed opacity-90 sm:opacity-80">
                  {slide.description}
                </p>

                {/* Tombol Aksi */}
                <div className="flex items-center pt-2 sm:pt-4">
                  <Link 
                    to={`/anime-details/${slide.id}`} 
                    className="flex items-center group/btn shadow-xl active:scale-95 transition-transform"
                  >
                    <span className="bg-primary group-hover/btn:bg-primary-dark text-white px-4 py-2.5 sm:px-6 sm:py-3 font-black text-[10px] sm:text-xs tracking-widest uppercase transition-colors rounded-l-xl">
                      Lihat Detail
                    </span>
                    <span className="bg-primary-dark p-2.5 sm:p-3.5 rounded-r-xl transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Tombol Navigasi Internal (Hanya muncul saat hover di Desktop, Hilang di Mobile) */}
        <button 
          onClick={prevSlide} 
          className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2.5 md:p-3 bg-black/30 hover:bg-white/20 backdrop-blur-md rounded-full transition-all border border-white/10 opacity-0 group-hover/container:opacity-100"
          aria-label="Previous Slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          onClick={nextSlide} 
          className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2.5 md:p-3 bg-black/30 hover:bg-white/20 backdrop-blur-md rounded-full transition-all border border-white/10 opacity-0 group-hover/container:opacity-100"
          aria-label="Next Slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Navigator Dots */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 sm:left-auto sm:right-12 -translate-x-1/2 sm:translate-x-0 flex gap-2 sm:gap-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 sm:h-1.5 transition-all duration-500 rounded-full ${currentSlide === index ? 'bg-primary w-6 sm:w-10' : 'bg-white/30 w-1.5 sm:w-3 hover:bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Carousel;