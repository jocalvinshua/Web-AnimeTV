import { useCallback, useState, useMemo } from "react";
import { useFetchAnime } from "../hook/useFetchAnime";
import { useSearchParams } from "react-router-dom";
import AnimeCard from "../components/AnimeCard";
import Pagination from "../components/Pagination";

function AnimeSchedule() {
  const currentDayName = useMemo(() => {
    return new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const [schedule, setSchedule] = useState(currentDayName);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const fetchParams = useMemo(
    () => ({
      page: currentPage,
      limit: 24,
      filter: schedule,
    }),
    [currentPage, schedule],
  );

  const days = [
    { id: 1, name: "Monday", value: "monday" },
    { id: 2, name: "Tuesday", value: "tuesday" },
    { id: 3, name: "Wednesday", value: "wednesday" },
    { id: 4, name: "Thursday", value: "thursday" },
    { id: 5, name: "Friday", value: "friday" },
    { id: 6, name: "Saturday", value: "saturday" },
    { id: 7, name: "Sunday", value: "sunday" },
  ];

  const handleChangeSchedule = useCallback(
    (selectedDay) => {
      setSchedule(selectedDay);
      setSearchParams({ page: 1 });
    },
    [setSearchParams],
  );

  const {
    data: animeSchedule,
    loading,
    pagination,
  } = useFetchAnime("schedules", fetchParams);

  return (
    <div className="min-h-screen px-4 md:px-12 lg:px-24 py-10">
      <header className="mb-10 flex flex-wrap p-3 gap-2 md:gap-4 justify-center rounded-2xl items-center bg-card w-fit mx-auto border border-white/5 shadow-lg">
        {days.map((item) => {
          const isActive = schedule === item.value;
          return (
            <button
              key={item.id}
              onClick={() => handleChangeSchedule(item.value)}
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                isActive
                  ? "bg-primary text-background shadow-md scale-105"
                  : "text-bright hover:text-primary hover:bg-white/5"
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </header>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <AnimeCard key={i} isLoading={true} />
            ))}
        </div>
      ) : animeSchedule && animeSchedule.length > 0 ? (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-black uppercase tracking-tight text-bright">
              Anime Schedule for{" "}
              <span className="text-primary capitalize">{schedule}</span>
            </h2>
            <p className="text-muted text-sm mt-1">
              {pagination?.items?.total || 0} titles airing
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {animeSchedule.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} isLoading={false} />
            ))}
          </div>

          {pagination?.last_visible_page > 1 && (
            <div className="mt-12 justify-center flex items-center">
              <Pagination lastPage={pagination.last_visible_page} />
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">empty</div>
          <h3 className="text-xl font-bold text-muted uppercase">
            {genreId
              ? `No Anime Found for this Genre`
              : `No Anime Found for "${query}"`}
          </h3>
          <p className="text-muted mt-2">
            Try searching with different keywords.
          </p>
        </div>
      )}
    </div>
  );
}

export default AnimeSchedule;
