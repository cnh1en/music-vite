import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import DataGrid from "../components/DataGrid";
import Loader from "../components/Loader";
import { PlayerContext } from "../context/PlayerContext";
import { getHomeContent } from "../services/home";

const Home = () => {
  const { setPlayerId, setIsPlayerIdChanged } = useContext(PlayerContext);
  const navigate = useNavigate();

  const { data, error } = useSWR("home", getHomeContent, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  if (!data) return <Loader />;

  return (
    <div className="pb-6 text-white">
      <h1 className="text-2xl mt-5 mb-3">Recommended</h1>
      <DataGrid
        data={data.recommendations.tracks.map((track) => ({
          id: track.id,
          image: (track as any)?.album?.images?.[0]?.url,
          title: track.name,
          description: track?.artists.map((artist) => artist.name).join(", "),
        }))}
        type="button"
        handler={(id: string) => {
          setPlayerId(id);
          setIsPlayerIdChanged(true);
        }}
      />

      <h1 className="text-2xl mt-5 mb-3">New Releases</h1>
      <DataGrid
        data={data.newReleases.albums.items.map((item) => ({
          id: item.id,
          image: (item as any)?.images?.[0]?.url,
          title: item.name,
        }))}
        type="link"
        handler={(id: string) => {
          navigate(`/album/${id}`);
        }}
      />

      <h1 className="text-2xl mt-5 mb-3">Top Playlist</h1>
      <DataGrid
        data={data.topPlaylists.map((item) => ({
          id: item.id,
          image: (item as any)?.images?.[0]?.url,
          title: item.name,
        }))}
        type="link"
        handler={(id: string) => {
          navigate(`/playlist/${id}`);
        }}
      />

      <h1 className="text-2xl mt-5 mb-3">Featured Playlists</h1>
      <DataGrid
        data={data.featuredPlaylists.playlists.items.map((item) => ({
          id: item.id,
          image: (item as any)?.images?.[0]?.url,
          title: item.name,
        }))}
        type="link"
        handler={(id: string) => {
          navigate(`/playlist/${id}`);
        }}
      />

      <h1 className="text-2xl mt-5 mb-3">Categories</h1>
      <DataGrid
        data={data.categories.categories.items.map((item) => ({
          id: item.id,
          image: item.icons[0].url,
          title: item.name,
        }))}
        type="link"
        handler={(id: string) => {
          navigate(`/category/${id}`);
        }}
      />
    </div>
  );
};

export default Home;
