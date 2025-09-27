// MusicAppBar.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, AppBarSection, AppBarSpacer } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import "../styles/MusicAppBar.css";

const MusicAppBar = ({ title  }) => {
  const navigate = useNavigate();

  const musicList = [
    { text: "track1", file: "/assets/bg1.mp3" },
    { text: "track2", file: "/assets/bg2.mp3" },
    { text: "track3", file: "/assets/bg3.mp3" }
  ];

  const [musicOn, setMusicOn] = useState(true);
  const [selectedMusic, setSelectedMusic] = useState(musicList[0].file);

  const bgAudioRef = useRef(new Audio(selectedMusic));
  const clickSound = useRef(new Audio("/assets/click.mp3"));

  // Initialize background audio
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

  const playClickSound = () => {
    clickSound.currentTime = 0;
    clickSound.current.play();
  };

  const toggleMusic = () => {
    playClickSound();
    setMusicOn(prev => !prev);
  };

  const changeMusic = (file) => {
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
    <AppBar className="k-appbar">
      
      <Button className="music-button" onClick={() => navigate("/")}>
          Home
        </Button>
        <AppBarSpacer />
      <AppBarSection>
        <h2>{title}</h2>
      </AppBarSection>
    <AppBarSpacer />
      <AppBarSection style={{ display: "flex", gap: "2rem" }}>
        <Button className="music-button" onClick={toggleMusic}>
          {musicOn ? "🔊 Music On" : "🔇 Music Off"}
        </Button>

        <select
          className="music-dropdown"
          value={selectedMusic}
          onChange={(e) => changeMusic(e.target.value)}
        >
          {musicList.map((m, idx) => (
            <option key={idx} value={m.file}>
              {m.text}
            </option>
          ))}
        </select>

        
      </AppBarSection>

      
    </AppBar>
  );
};

export default MusicAppBar;
