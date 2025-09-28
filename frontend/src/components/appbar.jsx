// MusicAppBar.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  AppBarSection,
  Avatar
} from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import "../styles/MusicAppBar.css";

const MusicAppBar = ({ title, onHomeClick }) => {
  const navigate = useNavigate();

  const musicList = [
    { text: "track1", file: "/assets/bg1.mp3" },
    { text: "track2", file: "/assets/bg2.mp3" },
    { text: "track3", file: "/assets/bg3.mp3" },
  ];

  const savedMusicOn = sessionStorage.getItem("musicOn");
  const savedSelectedMusic = sessionStorage.getItem("selectedMusic");

  const [musicOn, setMusicOn] = useState(
    savedMusicOn !== null ? savedMusicOn === "true" : true
  );
  const [selectedMusic, setSelectedMusic] = useState(
    savedSelectedMusic || musicList[0].file
  );

  const bgAudioRef = useRef(new Audio(selectedMusic));
  const clickSound = useRef(new Audio("/assets/click.mp3"));

  useEffect(() => {
    const audio = bgAudioRef.current;
    audio.loop = true;
    audio.volume = 0.5;
    audio.src = selectedMusic;
    if (musicOn) audio.play().catch(console.log);
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem("musicOn", musicOn);
    const audio = bgAudioRef.current;
    if (musicOn) audio.play().catch(console.log);
    else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [musicOn]);

  useEffect(() => {
    sessionStorage.setItem("selectedMusic", selectedMusic);
  }, [selectedMusic]);

  const playClickSound = () => {
    clickSound.currentTime = 0;
    clickSound.current.play();
  };

  const toggleMusic = () => {
    playClickSound();
    setMusicOn((prev) => !prev);
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

  const goToPlayerBooks = () => {
    playClickSound();
    navigate("/player-books");
  };

  return (
    <AppBar className="k-appbar">
      {/* Avatar Background */}
      <div className="appbar-avatar-bg">
        <Avatar style={{backgroundColor: "#CD853F"}}
          type="text"
          shape="square"
          size="large" 
        />
        <Avatar style={{backgroundColor: "#CD853F"}}
          type="image"
          shape="square"
          size="large" 
        />
        <Avatar style={{backgroundColor: "#CD853F"}}
          type="image"
          shape="square"
          size="large"
        />
      </div>

      {/* Left: Home */}
      <AppBarSection className="appbar-left">
        <Button
          className="music-button"
          onClick={() => onHomeClick && onHomeClick()}
        >
          Home
        </Button>
      </AppBarSection>

      {/* Center: Title */}
      <AppBarSection className="appbar-center">
        <h2>{title}</h2>
      </AppBarSection>

      {/* Right: Music + Player Books */}
      <AppBarSection className="appbar-right">
        <Button className="music-button" onClick={toggleMusic}>
          {musicOn ? "🔊 On" : "🔇 Off"}
        </Button>

        <select
          className="music-dropdown"
          value={selectedMusic}
          onChange={(e) => changeMusic(e.target.value)}
          style={{ WebkitAppearance: "none", // Chrome/Safari
      MozAppearance: "none", // Firefox
      appearance: "none",fontFamily: "'Dancing Script', cursive, serif" }}
        >
          {musicList.map((m, idx) => (
            <option key={idx} value={m.file} className="music-dropdown">
              {m.text}
            </option>
          ))}
        </select>

        <Button className="music-button" onClick={goToPlayerBooks}>
          Books
        </Button>
      </AppBarSection>
    </AppBar>
  );
};

export default MusicAppBar;
