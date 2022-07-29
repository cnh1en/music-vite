import client from "../shared/spotify-client";

export const getPlaylistInfo = async (playlistId: string) => {
  const result = await client.getPlaylist(playlistId);
  return result;
};
