import { useContext, useEffect, useState } from "react";
import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import Album from "./pages/Album";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import client from "./shared/spotify-client";
import Search from "./pages/Search";
import Player from "./components/Player";
import { PlayerContext } from "./context/PlayerContext";
import Playlist from "./pages/Playlist";
import Categories from "./pages/Categories";
import Artist from "./pages/Artist";

enum LoadingStates {
  loading,
  finished,
  error,
}

function App() {
  const [loadingState, setLoadingState] = useState(LoadingStates.loading);
  const { playerId } = useContext(PlayerContext);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("minizing-playing", playerId);
  }, [playerId]);

  useEffect(() => {
    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(
          `${import.meta.env.VITE_CLIENT_ID}:${
            import.meta.env.VITE_CLIENT_SECRET
          }`
        )}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          setLoadingState(LoadingStates.finished);
          client.setAccessToken(data.access_token);
        } else setLoadingState(LoadingStates.error);
      })
      .catch((err) => {
        console.log(err);
        setLoadingState(LoadingStates.error);
      });
  }, []);

  useEffect(() => {
    window.scroll(0, 0);
  }, [location]);
  return (
    <div className="bg-dark">
      <Navbar />
      <div className="min-h-[100vh] mx-[5vw] mt-[5vh] pb-24">
        <Routes>
          <Route index element={<Home />} />
          <Route path="album/:id" element={<Album />} />
          <Route path="playlist/:id" element={<Playlist />} />
          <Route path="category/:id" element={<Categories />} />
          <Route path="artist/:id" element={<Artist />} />
          <Route path="search" element={<Search />} />
        </Routes>
      </div>

      {!!playerId && <Player key={playerId} />}
    </div>
  );
}

export default App;
