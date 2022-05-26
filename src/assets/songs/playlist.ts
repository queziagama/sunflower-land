import willow_tree from "./willow_tree.mp3";
import harvesting from "./harvesting.mp3";
import mountain_escape from "./mountain_escape.mp3";
// Playlist hardcoded, but eventually it will be fetched from the server
const farming_songs = [
  {
    artist: "Romy & Rick",
    name: "Harvesting",
    path: harvesting,
  },
  {
    artist: "Romy",
    name: "Willow Tree",
    path: willow_tree,
  },
];

const goblin_songs = [
  {
    artist: "Romy & Rick",
    name: "Mountain Escape",
    path: mountain_escape,
  },
];

export const getFarmingSong = (index: number) => {
  return farming_songs[index];
};

export const getFarmingSongCount = () => {
  return farming_songs.length;
};

export const getGoblinSong = (index: number) => {
  return goblin_songs[index];
};

export const getGoblinSongCount = () => {
  return goblin_songs.length;
};
