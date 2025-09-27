import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "@progress/kendo-react-progressbars";
import { Fade } from "@progress/kendo-react-animation";
import Appbar from "../components/appbar";
import TimeLine from "../components/TimeLine/TimeLine";
import "../styles/character_profile.css"; // reusing the same CSS

// Sounds
const clickSound = new Audio("/assets/click.mp3");
const successSound = new Audio("/assets/success.mp3");
const pageFlipSound = new Audio("/assets/page-flip.mp3");

// Animated progress bar
const AnimatedStat = ({ value, delay = 0 }) => {
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
const StaggeredStats = ({ stats }) => {
  const statEntries = Object.entries(stats || {});
  return (
    <div className="character-stats">
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

export default function GamePage() {
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [currentStats, setCurrentStats] = useState({});
  const [timelineNodes, setTimelineNodes] = useState([]);
  const [message, setMessage] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [flipType, setFlipType] = useState(null);

  // Load character and node
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("selectedCharacterNode"));
    if (!savedData) {
      navigate("/");
      return;
    }
    setGameData(savedData);
    setCurrentStats(savedData.character.stats);
    setTimelineNodes(savedData.character.timelineData.events);
  }, [navigate]);

  if (!gameData) return null;

  const { character, node } = gameData;

  // Handle choice cards
  const handleCardChoice = (choice) => {
    clickSound.currentTime = 0;
    clickSound.play();

    // Update stats dynamically
    const newStats = {};
    Object.keys(currentStats).forEach((key) => {
      newStats[key] = currentStats[key] + Math.floor(Math.random() * 11 - 5);
      if (newStats[key] < 0) newStats[key] = 0;
      if (newStats[key] > 100) newStats[key] = 100;
    });
    setCurrentStats(newStats);

    // Update timeline
    const lastNode = timelineNodes[timelineNodes.length - 1];
    const newNode = {
      id: lastNode.id + 1,
      title: `${choice} Outcome`,
      y: lastNode.y + Math.floor(Math.random() * 10 + 5),
      stats: newStats,
      personality: `After choosing "${choice}", ${character.name} feels stronger!`,
    };
    setTimelineNodes([...timelineNodes, newNode]);

    // Feedback message
    setMessage(`You chose "${choice}"! Stats updated and timeline advanced.`);

    successSound.currentTime = 0;
    successSound.play();
  };

  const goHome = () => {
    pageFlipSound.currentTime = 0;
    pageFlipSound.play();
    setFlipType("home");
    setFlipped(true);
    setTimeout(() => navigate("/"), 1200);
  };

  return (
    <div className="character-page-container">
      <div className={`character-page-book ${flipped ? "flipped" : ""}`}>
        {/* FRONT FACE */}
        <div className="character-page-front">
          <Appbar title="Game Page" onHomeClick={goHome} />

          <div className="Top">
            {/* Character Preview */}
            <div className="character-preview" style={{ marginTop: "2rem" }}>
              <h2>{character.name}</h2>
              <img src={character.img} alt={character.name} className="char-full-image" />
              <p>{timelineNodes[timelineNodes.length - 1]?.personality || node.personality}</p>
              <StaggeredStats stats={currentStats} />
            </div>

            {/* Timeline */}
            <div>
              <h3>Timeline</h3>
              <TimeLine timelineData={{ events: timelineNodes }} />
            </div>
          </div>

          {/* Choice Cards */}
          <div className="choice-cards">
            {["Option 1", "Option 2", "Option 3"].map((option) => (
              <div
                key={option}
                className="k-card"
                onClick={() => handleCardChoice(option)}
              >
                <div className="k-card-header">
                  <h4>{option}</h4>
                </div>
                <div className="k-card-body">
                  <p>Click to see what happens</p>
                </div>
              </div>
            ))}
            {message && (
              <p style={{ marginTop: "1rem", fontStyle: "italic", color: "#FFD700" }}>
                {message}
              </p>
            )}
          </div>
        </div>

        {/* BACK FACE */}
        <div className="character-page-back">
          {flipType === "home" && <p>Going back home...</p>}
        </div>
      </div>
    </div>
  );
}
