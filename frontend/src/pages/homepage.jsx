import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody } from "@progress/kendo-react-layout";
import { Tooltip } from "@progress/kendo-react-tooltip";
import { Badge } from "@progress/kendo-react-indicators";

import TimeLine from "../components/TimeLine/TimeLine";
import "../styles/homepage.css";
import Book from "../components/Book/Book";
import MusicAppBar from "../components/appbar";

// Era icons
import ancientIcon from "/assets/ancient-Icon.png";
import medievalIcon from "/assets/medieval-Icon.png";
import renaissanceIcon from "/assets/renaissance-Icon.png";
// Character icons
import arthurIcon from "/assets/arthur.png";
import cleopatraIcon from "/assets/cleopatra.png";
import leonardoIcon from "/assets/leonardo.png";

// Timeline data
import { caesarTimelineeg } from "../data/eg";
import { caesarTimeline } from "../data/caesar";

// Sounds
const clickSound = new Audio("/assets/click.mp3");
const pageFlipSound = new Audio("/assets/page-flip.mp3");

export default function HomePage() {
  const [flipped, setFlipped] = useState(false);
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

  const handleHeroCardClick = (name) => {
    playClickSound();
  };

  const eras = [
    { name: "Ancient Era", icon: ancientIcon, description: "Step into the dawn of civilization, where kings, empires, and legendary heroes shaped history.", className: "ancient-era", badge: false },
    { name: "Medieval Era", icon: medievalIcon, description: "Explore castles, knights, and epic quests in a world of chivalry and intrigue.", className: "medieval-era", badge: true },
    { name: "Renaissance Era", icon: renaissanceIcon, description: "Witness the rebirth of art, science, and culture as visionaries change the world.", className: "renaissance-era", badge: true },
    { name: "Industrial Era", icon: "/assets/industrial-icon.png", description: "Discover the rise of machines, industry, and urban civilization.", className: "industrial-era", badge: false },
    { name: "Modern Era", icon: "/assets/modern-icon.png", description: "Experience contemporary history with global events, innovations, and revolutions.", className: "modern-era", badge: false }
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
          <MusicAppBar
            title="Legends Of History"
            onHomeClick={() => {}}
          />

          {/* Welcome Portal */}
          <Card className="welcome-portal" onClick={handlePortalClick}>
            <CardHeader><h1>Welcome, Adventurer!</h1></CardHeader>
            <CardBody>
              <p>Immerse yourself in an interactive world of empires, heroes, and discoveries. Click to unlock your journey through time.</p>
            </CardBody>
          </Card>

          {/* Eras Section */}
          <div className="hero-section">
            <h2 className="hero-title">Explore Epic Eras</h2>
            <div className="hero-cards-container">
              {eras.map((era, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <Tooltip content={`Click to explore the ${era.name}`}>
                    {era.badge && (
                      <Badge shape="circle" themeColor="primary" size="large" style={{ position: 'absolute', top: '10px', right: '10px' }}>!</Badge>
                    )}
                    <Card className={`hero-card ${era.className}`} onClick={() => handleHeroCardClick(era.name)}>
                      <img src={era.icon} alt={era.name} className="era-icon" />
                      <CardHeader><h3>{era.name}</h3></CardHeader>
                      <CardBody><p>{era.description}</p></CardBody>
                    </Card>
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>

          {/* Characters Section */}
          <div className="hero-section">
            <h2 className="hero-title">Play As Famous Legends</h2>
            <div className="hero-cards-container">
              {characters.map((char, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <Tooltip content={`Play as ${char.name} from the ${char.era} Era`}>
                    <Card className={`hero-card ${char.era.toLowerCase()}-era`} onClick={() => handleHeroCardClick(char.name)}>
                      <img src={char.img} alt={char.name} className="era-icon" />
                      <CardHeader><h3>{char.name}</h3></CardHeader>
                      <CardBody><p>{char.era} Era</p></CardBody>
                    </Card>
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="hero-section">
            <h2 className="hero-title" style={{ marginBottom: '0px' }}>Dynamic Timeline</h2>
            <span style={{ fontSize: '20px' }}>Watch And Change History With Your Decisions.</span>
            <TimeLine timelineData={caesarTimelineeg} />
          </div>

          {/* Interactive Storybook Section */}
          <div className="hero-section">
            <h2 className="hero-title" style={{ marginBottom: '0px' }}>Ancient Chronicles</h2>
            <p style={{ fontSize: '20px' }}>Flip through the story of your timeline.</p>
            <div className="inline-book-wrapper">
              <Book
                character={{ name: "Caesar", era: "Ancient", img: "/assets/julius_caesar.png" }}
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
