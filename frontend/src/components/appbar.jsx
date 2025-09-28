// MusicAppBar.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
} from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import "../styles/MusicAppBar.css";

const MusicAppBar = ({ title, onHomeClick }) => {
  const navigate = useNavigate(); // <-- initialize navigate

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
    navigate("/player-books"); // <-- navigate to player-books page
  };

  return (
    <AppBar className="k-appbar" style={{ display: "flex", alignItems: "center", padding: "0 1rem", height: "60px" }}>
      {/* Left: Home */}
      <AppBarSection style={{ flex: "0 0 auto" }}>
        <Button className="music-button" onClick={() => onHomeClick && onHomeClick()}>
          Home
        </Button>
      </AppBarSection>

      {/* Center: Title */}
      <AppBarSection
        style={{
          flex: "1 1 auto",
          textAlign: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          padding: "0 1rem",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1rem", lineHeight: "1.2" }}>{title}</h2>
      </AppBarSection>

      {/* Right: Music + Player Books */}
      <AppBarSection
        style={{
          flex: "0 0 auto",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <Button className="music-button" onClick={toggleMusic}>
          {musicOn ? "🔊 On" : "🔇 Off"}
        </Button>

        <select className="music-dropdown" value={selectedMusic} onChange={(e) => changeMusic(e.target.value)}>
          {musicList.map((m, idx) => (
            <option key={idx} value={m.file}>
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
