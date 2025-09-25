import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, AppBarSection, AppBarSpacer, Card, CardHeader, CardBody } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { TreeView } from "@progress/kendo-react-treeview";
import { Tooltip } from "@progress/kendo-react-tooltip";

import "../styles/homepage.css";

// Era icons
import ancientIcon from "../assets/ancient-icon.png";
import medievalIcon from "../assets/medieval-icon.png";
import renaissanceIcon from "../assets/renaissance-icon.png";

// Character icons
import arthurIcon from "../assets/arthur.png";
import cleopatraIcon from "../assets/cleopatra.png";
import leonardoIcon from "../assets/leonardo.png";

// Sounds
const clickSound = new Audio("/assets/click.mp3");
const pageFlipSound = new Audio("/assets/page-flip.mp3");

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
    setTimeout(() => {
      navigate("/era-select");
    }, 1000);
  };

  const toggleMusic = () => {
    playClickSound();
    setMusicOn(!musicOn);
  };

  const handleHeroCardClick = (name) => {
    playClickSound();
    console.log(`Clicked on ${name}`);
  };

  const handleFabClick = () => {
    playClickSound();
  };

  const eras = [
    {
      name: "Ancient Era",
      icon: ancientIcon,
      description: "Explore the dawn of civilizations, from pyramids to Greek philosophy.",
      className: "ancient-era"
    },
    {
      name: "Medieval Era",
      icon: medievalIcon,
      description: "Discover castles, knights, and the mysteries of the medieval world.",
      className: "medieval-era"
    },
    {
      name: "Renaissance Era",
      icon: renaissanceIcon,
      description: "Witness the rebirth of art, science, and culture across Europe.",
      className: "renaissance-era"
    }
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
        { text: "Build the Great Pyramid", tooltip: "Decision: Allocate resources to pyramid construction." },
        { text: "Found Athens", tooltip: "Decision: Establish Athens as a city-state." }
      ]
    },
    {
      text: "Medieval Era",
      items: [
        { text: "Crusades", tooltip: "Decision: Participate in religious wars for territory." },
        { text: "Feudal System", tooltip: "Decision: Implement feudal hierarchy for stability." }
      ]
    },
    {
      text: "Renaissance Era",
      items: [
        { text: "Patron Leonardo", tooltip: "Decision: Fund Leonardo da Vinci's projects." },
        { text: "Explore New World", tooltip: "Decision: Send explorers across the Atlantic." }
      ]
    }
  ];

  const renderTimelineItem = (props) => {
    const item = props.item;
    return (
      <Tooltip content={item.tooltip} position="right">
        <span>{item.text}</span>
      </Tooltip>
    );
  };

  return (
    <div className={`homepage-container ${flipped ? "flipped" : ""}`}>
      {/* ---------------- AppBar ---------------- */}
      <AppBar className="k-appbar">
        <AppBarSection>
          <h2>My Medieval Homepage</h2>
        </AppBarSection>
        <AppBarSection>
          <Button
            icon="music"
            className={`music-button ${musicOn ? "pulse" : "pulse-flip"}`}
            onClick={toggleMusic}
          >
            {musicOn ? "🔉 Music" : "🔇 Music"}
          </Button>
        </AppBarSection>
      </AppBar>
      <AppBarSpacer />

      {/* ---------------- Welcome Portal ---------------- */}
      <Card
        className="welcome-portal"
        onClick={handlePortalClick}
        style={{ cursor: "pointer", textAlign: "center" }}
      >
        <CardHeader>
          <h1>Welcome, Traveler!</h1>
        </CardHeader>
        <CardBody>
          <p>Click here to begin your journey</p>
        </CardBody>
      </Card>

      {/* ---------------- Era Section ---------------- */}
      <div className="hero-section">
        <h2 className="hero-title">Explore Various Eras</h2>
        <div className="hero-cards-container">
          {eras.map((era, index) => (
            <Card
              key={index}
              className={`hero-card ${era.className}`}
              onClick={() => handleHeroCardClick(era.name)}
            >
              <img src={era.icon} alt={era.name} className="era-icon" />
              <CardHeader>
                <h3>{era.name}</h3>
              </CardHeader>
              <CardBody>
                <p>{era.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* ---------------- Character Preview Section ---------------- */}
      <div className="hero-section">
        <h2 className="hero-title">Playable Characters (Preview)</h2>
        <div className="hero-cards-container">
          {characters.map((char, index) => (
            <Card
              key={index}
              className={`hero-card ${char.era.toLowerCase()}-era`}
              onClick={() => handleHeroCardClick(char.name)}
            >
              <img src={char.img} alt={char.name} className="era-icon" />
              <CardHeader>
                <h3>{char.name}</h3>
              </CardHeader>
              <CardBody>
                <p>{char.era} Era</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* ---------------- Timeline & Decisions ---------------- */}
      <div style={{ maxWidth: 600, margin: "2rem auto" }}>
        <h2 className="hero-title">Timeline & Decisions</h2>
        <TreeView
          data={timelineData}
          expandIcons={true}
          textField="text"
          childrenField="items"
          item={renderTimelineItem}
        />
      </div>

      {/* ---------------- Floating Action Button ---------------- */}
      <Button
        className="k-fab"
        onClick={handleFabClick}
        themeColor="primary"
        rounded="full"
      >
        +
      </Button>
    </div>
  );
}
