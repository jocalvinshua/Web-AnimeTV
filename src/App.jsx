import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import AnimeDetails from "./components/AnimeDetails.jsx";
import "./style.css"
import Anime from "./pages/Anime.jsx";
import CollectionList from "./pages/CollectionList.jsx";

export default function App(){
  return(
    <div className="min-h-screen bg-main text-bright flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/anime-details/:id" element={<AnimeDetails/>} />
          <Route path="/anime/genre/:genreId/:genreName" element={<Anime />} />
          <Route path="/anime/season/:season" element={<Anime />} />
          <Route path="/anime/season/:year/:season" element={<Anime />} />
          
          {/* Tambahkan tanda ? agar :query bersifat opsional */}
          <Route path="/anime/:query?" element={<Anime />} />

          {/* Route handling tag */}
          <Route path="/anime/seasons" element={<CollectionList type="seasons" />} />
          <Route path="/anime/genres" element={<CollectionList />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}