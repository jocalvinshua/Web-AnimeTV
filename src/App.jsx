import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import AnimeDetails from "./components/AnimeDetails.jsx";
import "./style.css";
import Anime from "./pages/Anime.jsx";
import CollectionList from "./pages/CollectionList.jsx";
import AnimeSchedule from "./pages/AnimeSchedule.jsx";
import TopAnime from "./pages/TopAnime.jsx";
export default function App() {
  return (
    <div className="min-h-screen bg-main text-bright flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/anime/schedule" element={<AnimeSchedule />} />
          <Route path="/anime-details/:id" element={<AnimeDetails />} />
          <Route path="/anime/top" element={<TopAnime />} />
          <Route path="/anime/genre/:genreId/:genreName" element={<Anime />} />
          <Route path="/anime/season/:season" element={<Anime />} />
          <Route path="/anime/season/:year/:season" element={<Anime />} />
          <Route path="/anime/movie" element={<Anime />} />

          <Route path="/anime/:query?" element={<Anime />} />

          <Route
            path="/anime/seasons"
            element={<CollectionList type="seasons" />}
          />
          <Route
            path="/anime/genres"
            element={<CollectionList type="genres" />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
