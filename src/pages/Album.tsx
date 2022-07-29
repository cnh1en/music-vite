import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import Loader from "../components/Loader";
import { PlayerContext } from "../context/PlayerContext";
import { getAlbumInfo } from "../services/album";
import { formatDuration } from "../shared/utils";

const Album = () => {
  const { setPlayerId } = useContext(PlayerContext);
  const { id } = useParams();

  const { data, error } = useSWR(`album-${id}`, () =>
    getAlbumInfo(id as string)
  );

  if (error) return <div>Error</div>;
  if (!data) return <Loader />;

  return (
    <div className="flex mt-8">
      <div className="w-1/4">
        <img src={data?.images[0].url} alt="" />
        <div className="text-white text-center">
          <h1 className="text-2xl">{data?.name}</h1>
          <span className="text-gray-500">
            {data?.artists.map((item) => item.name).join(", ")}
          </span>
        </div>
      </div>
      <div className="w-3/4 text-white ml-10">
        {data?.tracks.items.map((item, index) => (
          <div
            className="flex justify-between items-center hover:bg-dark-hovered py-3 px-4 cursor-pointer"
            onClick={() => setPlayerId(item.id)}
          >
            <div className="flex items-center gap-6">
              <span className="text-lg">{index + 1}</span>
              <div className="flex flex-col">
                <h1 className="text-lg">{item.name}</h1>
                <span className="text-gray-600">
                  {item.artists.map((artist) => artist.name).join(", ")}
                </span>
              </div>
            </div>

            <div>{formatDuration(item.duration_ms)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Album;
