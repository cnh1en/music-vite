import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { PlayerContext } from "../context/PlayerContext";
import { getPlaylistInfo } from "../services/playlist";
import { formatDuration } from "../shared/utils";

const Playlist = () => {
  const { setPlayerId } = useContext(PlayerContext);
  const { id } = useParams();

  const { data, error } = useSWR(`playlist-${id}`, () =>
    getPlaylistInfo(id as string)
  );
  console.log({ data, error });
  return (
    <div className="flex mt-8">
      <div className="w-1/4">
        <img src={data?.images[0].url} alt="" />
        <div className="text-white mt-2 text-center">
          <h1 className="text-2xl">{data?.name}</h1>
          <span className="text-gray-500">{data?.owner.display_name}</span>
        </div>
      </div>
      <div className="w-3/4 text-white ml-10">
        {data?.tracks.items
          .filter((track) => track.track)
          .map(({ track }, index) => (
            <div
              className="flex justify-between items-center hover:bg-dark-hovered py-3 px-4 cursor-pointer"
              onClick={() => setPlayerId(track.id)}
            >
              <div className="flex items-center gap-6">
                <span className="text-lg">{index + 1}</span>
                <div className="flex flex-col">
                  <h1 className="text-lg">{track.name}</h1>
                  <span className="text-gray-600">
                    {(track as any).artists
                      .map((artist: any) => artist.name)
                      .join(", ")}
                  </span>
                </div>
              </div>

              <div>{formatDuration(track.duration_ms)}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Playlist;
