import client from "../shared/spotify-client";

export const searchByKeywords = async (q: string) => {
  const result = await client.search(q, [
    "album",
    "artist",
    "playlist",
    "track",
  ]);
  return result;
};
