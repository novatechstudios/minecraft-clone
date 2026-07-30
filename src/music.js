const songs = ["./assets/music/sweden.mp3", "./assets/music/aria-math.mp3", "./assets/music/beg.mp3", "./assets/music/mc.mp3", "./assets/music/sl.mp3"];
const chosenSong = songs[Math.floor(Math.random() * songs.length)];

const music = new Audio(chosenSong).play();
