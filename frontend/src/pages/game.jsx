import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "@progress/kendo-react-progressbars";
import { Fade } from "@progress/kendo-react-animation";
import Appbar from "../components/appbar";
import TimeLine from "../components/TimeLine/TimeLine";
import "../styles/character_profile.css";

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
            <p>
              {stat.charAt(0).toUpperCase() + stat.slice(1)}: {value}
            </p>
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

  // NEW: choices + current event
  const [choices, setChoices] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [previousEvents, setPreviousEvents] = useState([]);

  // ✅ define fetchChoices first
  const fetchChoices = async (prevEvents, currEvent) => {
    console.log("Fetching choices for:", currEvent, prevEvents);
    try {
      const res = await fetch('http://localhost:5000/get-options', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    currentEvent: currEvent ,
    previousEvents: prevEvents
  })
});
      const data = await res.json();
      console.log("Received choices:", data.choice1.description);
      // Backend returns choice1, choice2, choice3
      setChoices([
        { ...data.choice1.description, id: "c1" },
        { ...data.choice2.description, id: "c2" },
        { ...data.choice3.description, id: "c3" },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  // Load character and first event
  useEffect(() => {
  const savedData = JSON.parse(localStorage.getItem("selectedCharacterNode"));
  console.log("Loaded game data:", savedData);
  if (!savedData) {
    navigate("/");
    return;
  }

  setGameData(savedData);
  setCurrentStats(savedData.character.stats);

  // Timeline is the character's full timeline
  const fullTimeline = savedData.character.timelineData.events;
  setTimelineNodes(fullTimeline);

  // Current event is the node saved in local storage
  const startNode = savedData.node;
  setCurrentEvent(startNode);

  // First fetch choices with current node from local storage
  fetchChoices([], startNode);
}, [navigate]);


  if (!gameData) return null;

  const { character } = gameData;

  // Handle choice click
  const handleChoiceClick = (choice) => {
    clickSound.currentTime = 0;
    clickSound.play();

    // Store old event in previousEvents
    const newPreviousEvents = [...previousEvents, currentEvent];
    setPreviousEvents(newPreviousEvents);

    // The choice now becomes the new current event
    const newEvent = {
      id: timelineNodes.length + 1,
      title: choice.event || "New Event",
      y:
        timelineNodes[timelineNodes.length - 1].y +
        Math.floor(Math.random() * 10 + 5),
      stats: choice.new_stats || currentStats,
      personality: choice.new_personality || "",
    };

    // Update timeline with new event
    const updatedTimeline = [...timelineNodes, newEvent];
    setTimelineNodes(updatedTimeline);
    setCurrentEvent(newEvent);

    // Update stats dynamically
    setCurrentStats(newEvent.stats);

    // Show feedback
    setMessage(`You chose: ${choice.description}`);

    successSound.currentTime = 0;
    successSound.play();

    // Fetch next 3 choices from backend
    fetchChoices(newPreviousEvents, newEvent);
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
              <img
                src={character.img}
                alt={character.name}
                className="char-full-image"
              />
              <p>
                {timelineNodes[timelineNodes.length - 1]?.personality ||
                  currentEvent?.personality}
              </p>
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
            {choices.map((choice, idx) => (
              <div
                key={choice.id || idx} // ✅ fixed key warning
                className="k-card"
                onClick={() => handleChoiceClick(choice)}
              >
                <div className="k-card-header">
                  <h4>{choice.description}</h4>
                </div>
                <div className="k-card-body">
                  <p>{choice.event}</p>
                </div>
              </div>
            ))}
            {message && (
              <p
                style={{
                  marginTop: "1rem",
                  fontStyle: "italic",
                  color: "#FFD700",
                }}
              >
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
