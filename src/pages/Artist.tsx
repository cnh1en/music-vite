import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import DataGrid from "../components/DataGrid";
import Loader from "../components/Loader";
import { PlayerContext } from "../context/PlayerContext";
import { getArtistInfo } from "../services/artist";
import { formatNumber } from "../shared/utils";

const Artist = () => {
  const { setIsPlayerIdChanged, setPlayerId } = useContext(PlayerContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, error } = useSWR(`artist-${id}`, () =>
    getArtistInfo(id as string)
  );

  console.log({ data });

  if (!!error) return <div>Error</div>;

  if (!data) return <Loader />;

  return (
    <div>
      <div className="info flex gap-10 items-center">
        <img
          src={data.artist?.images[0].url}
          alt="avt"
          className="w-[250px] h-[250px] rounded-full"
        />
        <div className="text-white flex flex-col gap-2">
          <h1 className="text-[50px] font-semibold">{data.artist?.name}</h1>
          <span className="text-xl">
            {formatNumber(data.artist?.followers.total)} followers
          </span>
          <p className="text-xl">Popularity: {data.artist?.popularity} / 100</p>
        </div>
      </div>

      <div className="text-white">
        <h1 className="text-2xl mt-5 mb-3">Top Tracks</h1>
        <DataGrid
          data={data.topTracks.tracks.map((track) => ({
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

        <h1 className="text-2xl mt-5 mb-3">Albums</h1>
        <DataGrid
          data={data.albums.items.map((item) => ({
            id: item.id,
            image: (item as any)?.images?.[0]?.url,
            title: item.name,
            description: (item as any)?.artists
              .map((artist: any) => artist.name)
              .join(", "),
          }))}
          type="button"
          handler={(id: string) => {
            navigate(`/album/${id}`);
          }}
        />

        <h1 className="text-2xl mt-5 mb-3">Related Artists</h1>
        <DataGrid
          data={data.relatedArtists.artists.map((item) => ({
            id: item.id,
            image: item?.images?.[0]?.url,
            title: item.name,
          }))}
          type="button"
          handler={(id: string) => {
            navigate(`/artist/${id}`);
          }}
        />
      </div>
    </div>
  );
};

export default Artist;
