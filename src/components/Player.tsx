import { useContext, useEffect, useRef, useState } from "react";
import {
  MdErrorOutline,
  MdPlayCircleOutline,
  MdRepeat,
  MdVolumeOff,
  MdVolumeUp,
} from "react-icons/md";
import useSWR from "swr";
import { PlayerContext } from "../context/PlayerContext";
import { getTrackInfo } from "../services/track";

import { IoMdPause } from "react-icons/io";
import { RiExternalLinkLine } from "react-icons/ri";
import { formatDuration } from "../shared/utils";
import Slider from "./Slider";
import Spinner from "./Spiner";

const Player = () => {
  const { playerId, setIsPlayerIdChanged } = useContext(PlayerContext);

  const { data, error } = useSWR(`track-${playerId}`, () =>
    getTrackInfo(playerId)
  );

  console.log("[SONG]: ", data);

  const isLoading = !data;
  const isError = data && (error || !data.preview_url);

  const [isPaused, setIsPaused] = useState(!setIsPlayerIdChanged);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(
    Number(localStorage.getItem("minizing-volume")) || 0.5
  );
  const [isMuted, setIsMuted] = useState(
    !!Number(localStorage.getItem("minizing-muted")) || false
  );

  const [isLoop, setIsLoop] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isPaused) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(() => setIsPaused(true));
    }
  }, [isPaused]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    localStorage.setItem("minizing-volume", String(volume));
    localStorage.setItem("minizing-muted", String(+isMuted));
  }, [volume, isMuted]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " ") {
        setIsPaused((prev) => !prev);
      }
    };

    const spacePressedHandler = (e: KeyboardEvent) => {
      if (e.key === " ") e.preventDefault();
    };

    window.addEventListener("keyup", handler);
    window.addEventListener("keydown", spacePressedHandler);

    return () => {
      window.removeEventListener("keyup", handler);
      window.removeEventListener("keydown", spacePressedHandler);
    };
  }, []);
  return (
    <div>
      <audio
        ref={audioRef}
        onTimeUpdateCapture={() => {
          if (audioRef.current) {
            console.log(audioRef.current.currentTime);
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedDataCapture={() => {
          if (audioRef.current) {
            console.log("START");
            setCurrentTime(0);
            setDuration(audioRef.current.duration);
          }
        }}
        onEndedCapture={() => {
          if (!isLoop) {
            setCurrentTime(0);
            setIsPaused(true);
            console.log("END");
          }
        }}
        src={data?.preview_url}
        className="hidden"
        loop={isLoop}
        autoPlay={false}
        hidden
      ></audio>

      <div className="px-[5vw] fixed bottom-0 left-0 w-full h-20 bg-dark border-t border-gray-700 flex items-center justify-between">
        {!isLoading && !isError && (
          <div className="flex items-center gap-2 w-1/3">
            <img
              src={data?.album.images[0].url}
              alt="image"
              className="w-14 h-14"
            />
            <div className="text-white">
              <h1 className="text-xl">{data?.name}</h1>
              <span className="text-gray-400">{data?.artists[0].name}</span>
            </div>
          </div>
        )}

        <div
          className={`player ${
            !isError && !isLoading ? "w-1/3" : "w-full"
          } flex justify-center flex-col text-white`}
        >
          <div className="flex items-center justify-center gap-6">
            <button
              data-tooltips={isLoop ? "Disable repeat" : "Enable repeat"}
              onClick={() => setIsLoop(!isLoop)}
              disabled={isLoading || isError}
            >
              <MdRepeat
                className={`${isLoop ? "fill-sky-500" : "fill-white"} w-5 h-5`}
              />
            </button>
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              disabled={isError}
            >
              {isLoading ? (
                <Spinner />
              ) : !isError ? (
                isPaused ? (
                  <MdPlayCircleOutline className="w-8 h-8 text-white" />
                ) : (
                  <IoMdPause className="w-8 h-8 text-white" />
                )
              ) : (
                <MdErrorOutline className="w-8 h-8 text-red-600" />
              )}
            </button>
            <a
              href={data?.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className={`${isError ? "pointer-events-none" : ""}`}
            >
              <RiExternalLinkLine className="fill-white w-5 h-5" />
            </a>
          </div>
          <div className="flex items-center gap-3 justify-center">
            <span className="flex-shrink-0">
              {formatDuration(currentTime * 1000)}
            </span>
            <Slider
              className="flex-grow max-w-[400px]"
              width={duration !== 0 ? (currentTime / duration) * 100 : 0}
              setWidth={(val: number) => {
                setCurrentTime((val / 100) * duration);
                if (audioRef.current) {
                  audioRef.current.currentTime = (val / 100) * duration;
                }
              }}
            />
            <span className="flex-shrink-0">
              {formatDuration(duration * 1000)}
            </span>
          </div>
        </div>

        {!isLoading && !isError && (
          <div className="w-1/3 flex items-center justify-end gap-3">
            <button
              onClick={() => {
                if (volume === 0) {
                  setIsMuted(true);
                  setVolume(1);
                } else {
                  setIsMuted((prev) => !prev);
                }
              }}
            >
              {isMuted || !volume ? (
                <MdVolumeOff className="text-white w-5 h-5" />
              ) : (
                <MdVolumeUp className="text-white w-5 h-5" />
              )}
            </button>
            <Slider
              className="w-[100px]"
              width={isMuted ? 0 : volume * 100}
              setWidth={(val: number) => {
                setVolume(val / 100);
                setIsMuted(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Player;
