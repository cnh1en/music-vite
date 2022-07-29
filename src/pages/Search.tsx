import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useSWR from "swr";
import DataGrid from "../components/DataGrid";
import Loader from "../components/Loader";
import { PlayerContext } from "../context/PlayerContext";
import { searchByKeywords } from "../services/search";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsPlayerIdChanged, setPlayerId } = useContext(PlayerContext);
  const { q } = Object.fromEntries(new URLSearchParams(location.search));

  const { data, error } = useSWR(`search-${q}`, () => searchByKeywords(q));

  console.log({ data });

  if (!data) return <Loader />;

  if (error) return <div>Error...</div>;

  return (
    <div className="mx-[5vw] pb-6 text-white">
      <h1 className="text-[40px] mt-5 mb-3">Search result for: {q}</h1>

      <h1 className="text-2xl mt-5 mb-3">Artist</h1>
      <DataGrid
        data={
          data.artists?.items
            .filter((artist) => artist.name)
            .map((artist) => ({
              id: artist.id,
              image: artist?.images[0]?.url,
              title: artist.name,
            })) as any
        }
        type="link"
        handler={(id: string) => {
          navigate(`/artist/${id}`);
        }}
      />

      <h1 className="text-2xl mt-5 mb-3">Tracks</h1>
      <DataGrid
        data={
          data.tracks?.items
            .filter((track) => track.name)
            .map((item) => ({
              id: item.id,
              image: item?.album.images[0]?.url,
              title: item.name,
            })) as any
        }
        type="link"
        handler={(id: string) => {
          // navigate(`/album/${id}`);
          console.log(id);
          setPlayerId(id);
          setIsPlayerIdChanged(true);
        }}
      />

      <h1 className="text-2xl mt-5 mb-3">Albums</h1>
      <DataGrid
        data={
          data.albums?.items
            .filter((album) => album.name)
            .map((album) => ({
              id: album.id,
              image: album?.images[0]?.url,
              title: album.name,
            })) as any
        }
        type="link"
        handler={(id: string) => {
          navigate(`/album/${id}`);
        }}
      />

      <h1 className="text-2xl mt-5 mb-3">Playlists</h1>
      <DataGrid
        data={
          data.playlists?.items
            .filter((playlist) => playlist.name)
            .map((playlist) => ({
              id: playlist.id,
              image: playlist?.images[0]?.url,
              title: playlist.name,
              description: playlist?.owner?.display_name,
            })) as any
        }
        type="link"
        handler={(id: string) => {
          navigate(`/playlist/${id}`);
        }}
      />
    </div>
  );
};

export default Search;
