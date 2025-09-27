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
import Book from "../components/Book/Book";
import { caesarTimeline } from "../data/caesar";
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
  const [zoom, setZoom] = useState(0.8);
  const navigate = useNavigate();
  const bgAudioRef = useRef(new Audio(musicList[0].file));

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
    console.log(`Selected ${name}`);
  };

  /* --- Data --- */
  const eras = [
    { 
      name: "Ancient Era", 
      icon: ancientIcon, 
      description: "Step into the dawn of civilization, where kings, empires, and legendary heroes shaped history.", 
      className: "ancient-era" 
    },
    { 
      name: "Medieval Era", 
      icon: medievalIcon, 
      description: "Explore castles, knights, and epic quests in a world of chivalry and intrigue.", 
      className: "medieval-era" 
    },
    { 
      name: "Renaissance Era", 
      icon: renaissanceIcon, 
      description: "Witness the rebirth of art, science, and culture as visionaries change the world.", 
      className: "renaissance-era" 
    }
  ];

  const characters = [
    { name: "Arthur", era: "Medieval", img: arthurIcon },
    { name: "Cleopatra", era: "Ancient", img: cleopatraIcon },
    { name: "Leonardo", era: "Renaissance", img: leonardoIcon }
  ];

  return (
    <div className="homepage-container">
      <div className={`homepage-book ${flipped ? "flipped" : ""}`}>

        {/* --- FRONT PAGE --- */}
        <div className="homepage-front">
          <AppBar className="k-appbar">
            <AppBarSection>
              <h2>🌟 Legends of History</h2>
            </AppBarSection>
            <AppBarSection style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                className={'music-button' }
                onClick={toggleMusic}
              >
                {musicOn ? "🔊 Music On" : "🔇 Music Off"}
              </Button>

              <DropDownButton
                className="music-dropdown"
                text="🎵"
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
            <CardHeader><h1>Welcome, Adventurer!</h1></CardHeader>
            <CardBody><p>Immerse yourself in an interactive world of empires, heroes, and
    discoveries. Click to unlock your journey through time.</p></CardBody>
          </Card>

          {/* Eras Section */}
          <div className="hero-section" >
            <h2 className="hero-title">Explore Epic Eras</h2>
            <div className="hero-cards-container" style={{ width: '95%'}}>
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
            <h2 className="hero-title">Play As Famous Legends</h2>
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
          <div className="hero-section">
            <h2 className="hero-title" style={{ marginBottom: '0px' }}>Dynamic Timeline</h2>
            <span style={{fontSize:'20px'}}>Watch And Change History With Your Decisions.</span>
            <TimeLine />
          </div>

          {/* Interactive Storybook Section */}
          <div className="hero-section">
            <h2 className="hero-title" style={{ marginBottom: '0px' }}>Ancient Chronicles</h2>
            <p style={{fontSize:'20px'}}>Flip through the story of Caesar and relive historical moments interactively.</p>
            <div className="inline-book-wrapper">
              <Book
                character={{ name: "Caesar", era: "Ancient", img: "/assets/cleopatra.png" }}
                story={caesarTimeline.events}
              />
            </div>
          </div>
        </div>

        {/* --- BACK PAGE --- */}
        <div className="homepage-back">
          <h1>🌍 Era Selection</h1>
          <p>Select your adventure to begin your historical journey.</p>
        </div>

      </div>
    </div>
  );
}
