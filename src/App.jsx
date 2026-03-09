import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import AnimeDetails from "./components/AnimeDetails.jsx";
import "./style.css"
import Anime from "./pages/Anime.jsx";

export default function App(){
  return(
    <div className="min-h-screen bg-main text-bright flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/anime-details/:id" element={<AnimeDetails/>} />
          <Route path="/anime/:query" element={<Anime />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}