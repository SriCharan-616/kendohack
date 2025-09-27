import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Fade } from "@progress/kendo-react-animation";
import { ProgressBar } from "@progress/kendo-react-progressbars";
import "../styles/character_profile.css";
import Appbar from "../components/appbar";

// Components
import TimeLine from "../components/TimeLine/TimeLine";
import Book from "../components/Book/Book";

// Import timelines
import { caesarTimeline } from "../data/caesar";
import { gandhiTimeline } from "../data/gandhi";
import { lincolnTimeline } from "../data/lincoln";

// Sounds
const clickSound = new Audio("/assets/click.mp3");
const pageFlipSound = new Audio("/assets/page-flip.mp3");

const characters = [
  { name: "Julius Caesar", era: "ancient-rome-era", img: "/assets/caesar.png", timelineData: caesarTimeline },
  { name: "Mahatma Gandhi", era: "modern-era", img: "/assets/gandhi.png", timelineData: gandhiTimeline },
  { name: "Abraham Lincoln", era: "industrial-revolution", img: "/assets/lincoln.png", timelineData: lincolnTimeline },
];


// Animated progress bar
const AnimatedStat = ({ value, delay }) => {
  const [fill, setFill] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let current = 0;
      const step = value / 50;
      const interval = setInterval(() => {
        current += step;
        if (current >= value) {
          current = value;
          clearInterval(interval);
        }
        setFill(Math.round(current));
      }, 10);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return <ProgressBar value={fill} label={false} />;
};

// Display stats with staggered animation
const StaggeredStats = ({ stats, timeline }) => {
  const statEntries = Object.entries(stats || {});
  return (
    <div className="character-stats" style={{ width: "100%", marginTop: "1rem" }}>
      {statEntries.map(([stat, value], index) => (
        <Fade key={stat} transitionEnterDuration={300}>
          <div className="stat-bar-wrapper" style={{ marginBottom: "0.8rem" }}>
            <p>{stat.charAt(0).toUpperCase() + stat.slice(1)}: {value}</p>
            <AnimatedStat value={value} delay={index * 300} />
          </div>
        </Fade>
      ))}
    </div>
  );
};

export default function CharacterProfile() {
  const { characterName } = useParams();
  const [selectedChar, setSelectedChar] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [flipType, setFlipType] = useState(null);
  const lastClickRef = useRef({ nodeId: null, time: 0 });
  const navigate = useNavigate();

  // Load selected character
  useEffect(() => {
    const char = characters.find(c => c.name.toLowerCase() === characterName.toLowerCase());
    if (!char) return;

    const events = char.timelineData.events;
    const lastEvent = events[events.length - 1];
    const maxY = Math.max(...events.map(e => e.y));
    const timelinePercent = maxY ? Math.round((lastEvent.y / maxY) * 100) : 0;

    setSelectedChar({
      ...char,
      stats: lastEvent.stats,
      timeline: timelinePercent
    });
  }, [characterName]);

  const goHome = () => {
    pageFlipSound.currentTime = 0;
    pageFlipSound.play();
    setFlipType("home"); 
    setFlipped(true);
    setTimeout(() => navigate("/"), 1200);
  };

  // Handle double-click on valid timeline node
  const handleNodeDoubleClick = (node) => {
  if (!selectedChar) return;

  // Save character and node details in localStorage
  const dataToSave = {
    character: selectedChar,
    node: node
  };
  localStorage.setItem("selectedCharacterNode", JSON.stringify(dataToSave));

  // Play page flip sound
  pageFlipSound.currentTime = 0;
  pageFlipSound.play();

  // Set flip animation type
  setFlipType("game");
  setFlipped(true);

  // Navigate after animation
  const encodedName = encodeURIComponent(selectedChar.name);
  setTimeout(() => navigate(`/game/${encodedName}`), 1200);
};

  if (!selectedChar) return <p style={{ padding: "2rem" }}>Character not found!</p>;

  return (
    <div className="character-page-container">
      <div className={`character-page-book ${flipped ? "flipped" : ""}`}>
        {/* FRONT FACE */}
        <div className="character-page-front">
          <Appbar title="Play Page" onHomeClick={goHome} />

          <div className="Top">
            <div className="character-preview" style={{ marginTop: "2rem" }}>
              <h2>{selectedChar.name} Main Timeline Stats</h2>
              <img src={selectedChar.img} alt={selectedChar.name} className="char-full-image" />
              <StaggeredStats stats={selectedChar.stats} timeline={selectedChar.timeline} />
            </div>

            <div style={{ flex: 1, maxWidth: "700px" }}>
              <h3 style={{ marginBottom: "1rem" }}>{selectedChar.name} Main Timeline Chronicles</h3>
              <Book
                character={selectedChar}
                story={selectedChar.timelineData.events}
              />
            </div>
          </div>

          <div style={{ padding: "2rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>Interactive Timeline</h3>
            <div style={{ overflowX: "auto", paddingBottom: "1rem" }}>
              <TimeLine
                timelineData={selectedChar.timelineData}
                onNodeDoubleClick={handleNodeDoubleClick} // ✅ double-click handler
              />
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div className="character-page-back">
          {flipType === "game" && <p className="game-flip">Entering the game...</p>}
          {flipType === "home" && <p className="home-flip">Going back home...</p>}
        </div>
      </div>
    </div>
  );
}
