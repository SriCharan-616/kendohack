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
import ancientIcon from "/assets/ancient-Icon.png";
import medievalIcon from "/assets/medieval-Icon.png";
import renaissanceIcon from "/assets/renaissance-Icon.png";
// Character icons
import arthurIcon from "/assets/arthur.png";
import cleopatraIcon from "/assets/cleopatra.png";
import leonardoIcon from "/assets/leonardo.png";

// Sounds
const clickSound = new Audio("/assets/click.mp3");
const pageFlipSound = new Audio("/assets/page-flip.mp3");


import  Appbar  from "../components/appbar";  

export default function HomePage() {
  const [flipped, setFlipped] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  
  const navigate = useNavigate();
  

  

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

 

  const handleHeroCardClick = (name) => {
    playClickSound();
    console.log(`Selected ${name}`);
  };

  /* --- Data --- */
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
  },
  { 
    name: "Industrial Era", 
    icon: "/assets/industrial-icon.png", 
    description: "Discover the rise of machines, industry, and urban civilization.", 
    className: "industrial-era" 
  },
  { 
    name: "Modern Era", 
    icon: "/assets/modern-icon.png", 
    description: "Experience contemporary history with global events, innovations, and revolutions.", 
    className: "modern-era" 
  }
];

const characters = [
  { name: "Arthur", era: "Medieval", img: arthurIcon },
  { name: "Cleopatra", era: "Ancient", img: cleopatraIcon },
  { name: "Leonardo", era: "Renaissance", img: leonardoIcon },
  { name: "Napoleon", era: "Modern", img: "/assets/napoleon.png" },
  { name: "Marie Curie", era: "Modern", img: "/assets/marie-curie.png" },
];


  return (
    <div className="homepage-container">
      <div className={`homepage-book ${flipped ? "flipped" : ""}`}>

        {/* --- FRONT PAGE --- */}
        <div className="homepage-front">
          <Appbar title='Legends Of History'/>

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
            <div className="hero-cards-container" style={{ width: '95%'}}>
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
                character={{ name: "Caesar", era: "Ancient", img: "/assets/caesar.png" }}
                story={caesarTimeline.events}
              />
            </div>
          </div>
        </div>

        {/* --- BACK PAGE --- */}
        <div className="homepage-back">
          <p>Select your adventure to begin your historical journey.</p>
        </div>

      </div>
    </div>
  );
}
