import { useState, useEffect, useRef } from "react";

// Music options


// Self-contained music dropdown
const MusicDropdown = () => {
    const musicList = [
    { text: "Medieval Tune", file: "/assets/bg1.mp3" },
    { text: "Ancient Melody", file: "/assets/bg2.mp3" },
    { text: "Renaissance Song", file: "/assets/bg3.mp3" }
    ];
  const [selectedMusic, setSelectedMusic] = useState(musicList[0].file);
  const [musicOn, setMusicOn] = useState(true);
  const bgAudioRef = useRef(new Audio(selectedMusic));
  const clickSound = useRef(new Audio("/assets/click.mp3"));

  // Initialize audio
  useEffect(() => {
    const audio = bgAudioRef.current;
    audio.loop = true;
    audio.volume = 0.5;
    if (musicOn) audio.play().catch(console.log);

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Toggle music on/off
  useEffect(() => {
    const audio = bgAudioRef.current;
    if (musicOn) audio.play().catch(console.log);
    else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [musicOn]);

  // Play click sound
  const playClickSound = () => {
    clickSound.currentTime = 0;
    clickSound.current.play();
  };

  // Handle music change
  const handleChange = (file) => {
    playClickSound();
    const audio = bgAudioRef.current;
    audio.pause();
    audio.currentTime = 0;
    audio.src = file;
    audio.play().catch(console.log);
    setSelectedMusic(file);
    setMusicOn(true);
  };

  return (
    <select
      value={selectedMusic}
      onChange={(e) => handleChange(e.target.value)}
      style={{
        padding: "6px 10px",
        fontSize: "1rem",
        cursor: "pointer",
        borderRadius: "4px",
        border: "1px solid #ccc",
        background: "#fff"
      }}
    >
      {musicList.map((m, idx) => (
        <option key={idx} value={m.file}>
          {m.text}
        </option>
      ))}
    </select>
  );
};

export default MusicDropdown;
