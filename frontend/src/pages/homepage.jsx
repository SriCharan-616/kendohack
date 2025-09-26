import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
  Card,
  CardHeader,
  CardBody
} from "@progress/kendo-react-layout";
import { Button, DropDownButton } from "@progress/kendo-react-buttons";
import TimeLine from "../components/TimeLine/TimeLine";
import "../styles/homepage.css";

// Era icons
import ancientIcon from "../assets/ancient-icon.png";
import medievalIcon from "../assets/medieval-icon.png";
import renaissanceIcon from "../assets/renaissance-icon.png";

// Character icons
import arthurIcon from "../assets/arthur.png";
import cleopatraIcon from "../assets/cleopatra.png";
import leonardoIcon from "../assets/leonardo.png";

// Parchment icon for dropdown
import parchmentIcon from "../assets/parchment-icon.png";

// Sounds
const clickSound = new Audio("/assets/click.mp3");
const pageFlipSound = new Audio("/assets/page-flip.mp3");

// Background music options
const musicList = [
  { text: "Medieval Tune", file: "/assets/bg2.mp3" },
  { text: "Ancient Melody", file: "/assets/bg_ancient.mp3" },
  { text: "Renaissance Song", file: "/assets/bg_renaissance.mp3" }
];

export default function HomePage() {
  const [flipped, setFlipped] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const [zoom, setZoom] = useState(0.8); // default smaller to fit background
  const navigate = useNavigate();
  const bgAudioRef = useRef(new Audio(musicList[0].file));

  /* --- Background Music Handling --- */
  useEffect(() => {
    const audio = bgAudioRef.current;
    audio.loop = true;
    audio.volume = 0.2;
    if (musicOn) audio.play().catch(console.log);
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

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
    clickSound.play();
  };

  const handlePortalClick = () => {
    pageFlipSound.currentTime = 0;
    pageFlipSound.play();
    setFlipped(true);
    setTimeout(() => navigate("/era-select"), 1200);
  };

  const toggleMusic = () => {
    playClickSound();
    setMusicOn(prev => !prev);
  };

  const changeMusic = (file) => {
    const audio = bgAudioRef.current;
    audio.pause();
    audio.currentTime = 0;
    audio.src = file;
    audio.play().catch(console.log);
    setMusicOn(true);
  };

  const handleHeroCardClick = (name) => {
    playClickSound();
    console.log(`Clicked on ${name}`);
  };

  /* --- Data --- */
  const eras = [
    { name: "Ancient Era", icon: ancientIcon, description: "Discover castles, knights, and the medieval world.", className: "ancient-era" },
    { name: "Medieval Era", icon: medievalIcon, description: "Discover castles, knights, and the medieval world.", className: "medieval-era" },
    { name: "Renaissance Era", icon: renaissanceIcon, description: "Witness the rebirth of art, science, and culture.", className: "renaissance-era" }
  ];

  const characters = [
    { name: "Arthur", era: "Medieval", img: arthurIcon },
    { name: "Cleopatra", era: "Ancient", img: cleopatraIcon },
    { name: "Leonardo", era: "Renaissance", img: leonardoIcon }
  ];

  const timelineData = [
    {
      text: "Ancient Era",
      items: [
        { text: "Build the Great Pyramid", tooltip: "Allocate resources to pyramid construction." },
        { text: "Found Athens", tooltip: "Establish Athens as a city-state." }
      ]
    },
    {
      text: "Medieval Era",
      items: [
        { text: "Crusades", tooltip: "Participate in religious wars for territory." },
        { text: "Feudal System", tooltip: "Implement feudal hierarchy for stability." }
      ]
    },
    {
      text: "Renaissance Era",
      items: [
        { text: "Patron Leonardo", tooltip: "Fund Leonardo da Vinci's projects." },
        { text: "Explore New World", tooltip: "Send explorers across the Atlantic." }
      ]
    }
  ];

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

  return (
    <div className="homepage-container">
      <div className={`homepage-book ${flipped ? "flipped" : ""}`}>

        {/* --- FRONT PAGE --- */}
        <div className="homepage-front">
          <AppBar className="k-appbar">
            <AppBarSection>
              <h2>My Medieval Homepage</h2>
            </AppBarSection>
            <AppBarSection style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                className={`music-button ${musicOn ? "pulse" : "pulse-flip"}`}
                onClick={toggleMusic}
              >
                {musicOn ? "🔉 Music" : "🔇 Music"}
              </Button>

              <DropDownButton
                className="music-dropdown"
                text={
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <img src={parchmentIcon} alt="parchment" className="parchment-icon" />
                  </span>
                }
                items={musicList.map(m => ({
                  text: m.text,
                  onClick: () => {
                    playClickSound();
                    changeMusic(m.file);
                  }
                }))}
                popupSettings={{ className: "custom-music-dropdown-popup" }}
              />
            </AppBarSection>
          </AppBar>
          <AppBarSpacer />

          {/* Welcome Portal */}
          <Card className="welcome-portal" onClick={handlePortalClick}>
            <CardHeader><h1>Welcome, Traveler!</h1></CardHeader>
            <CardBody><p>Click here to begin your journey</p></CardBody>
          </Card>

          {/* Eras Section */}
          <div className="hero-section">
            <h2 className="hero-title">Explore Various Eras</h2>
            <div className="hero-cards-container">
              {eras.map((era, idx) => (
                <Card key={idx} className={`hero-card ${era.className}`} onClick={() => handleHeroCardClick(era.name)}>
                  <img src={era.icon} alt={era.name} className="era-icon" />
                  <CardHeader><h3>{era.name}</h3></CardHeader>
                  <CardBody><p>{era.description}</p></CardBody>
                </Card>
              ))}
            </div>
          </div>

          {/* Characters Section */}
          <div className="hero-section">
            <h2 className="hero-title">Playable Characters (Preview)</h2>
            <div className="hero-cards-container">
              {characters.map((char, idx) => (
                <Card key={idx} className={`hero-card ${char.era.toLowerCase()}-era`} onClick={() => handleHeroCardClick(char.name)}>
                  <img src={char.img} alt={char.name} className="era-icon" />
                  <CardHeader><h3>{char.name}</h3></CardHeader>
                  <CardBody><p>{char.era} Era</p></CardBody>
                </Card>
              ))}
            </div>
          </div>

          {/* Timeline Section */}
          <div
            className="timeline-wrapper"
            style={{
              overflow: "auto",
              padding: "1rem",
              backgroundImage: "url('/assets/homepage-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "12px",
              position: "relative"
            }}
          >
            {/* Zoom buttons inside timeline container */}
            <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10, display: "flex", gap: "0.5rem" }}>
              <Button onClick={zoomIn}>+</Button>
              <Button onClick={zoomOut}>-</Button>
            </div>

            <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}>
              <TimeLine timelineData={timelineData} />
            </div>
          </div>
        </div>

        {/* --- BACK PAGE --- */}
        <div className="homepage-back">
          <h1>You entered the Era Select!</h1>
        </div>

      </div>
    </div>
  );
}
