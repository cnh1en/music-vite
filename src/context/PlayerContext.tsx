import { createContext, useState } from "react";

interface PlayerContextProps {
  playerId: string;
  setPlayerId: Function;
  isPlayerIdChanged: boolean;
  setIsPlayerIdChanged: Function;
}
export const PlayerContext = createContext<PlayerContextProps>({
  playerId: "",
  setPlayerId: () => {},
  isPlayerIdChanged: false,
  setIsPlayerIdChanged: () => {},
});

export const PlayerContextProvider = ({ children }: any) => {
  const [playerId, setPlayerId] = useState(
    localStorage.getItem("minizing-playing") || ""
  );

  const [isPlayerIdChanged, setIsPlayerIdChanged] = useState(false);

  return (
    <PlayerContext.Provider
      value={{
        playerId,
        setPlayerId,
        isPlayerIdChanged,
        setIsPlayerIdChanged,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
