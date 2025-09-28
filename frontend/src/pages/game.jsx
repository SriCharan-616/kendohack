import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "@progress/kendo-react-progressbars";
import { Fade } from "@progress/kendo-react-animation";
import Appbar from "../components/appbar";
import TimeLine from "../components/TimeLine/TimeLine";
import "../styles/game_page.css";

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
  const [loadingChoices, setLoadingChoices] = useState(false);
  const [y,sety] = useState(0);
  // NEW: choices + current event
  const [choices, setChoices] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [previousEvents, setPreviousEvents] = useState([]);
  const [name,setname] = useState("");
  // ✅ define fetchChoices first
  const fetchChoices = async (name, prevEvents, currEvent) => {
     setLoadingChoices(true);
    console.log("Fetching choices for:", currEvent, prevEvents);
    try {
      const res = await fetch('http://localhost:5000/get-options', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: name ,
    currentEvent: currEvent ,
    previousEvents: prevEvents
  })
});
      const data = await res.json();
      console.log("Received choices:", data.choice1.description);
      console.log("Received choices:", data.choice1);
      // Backend returns choice1, choice2, choice3
      setChoices([
        { ...data.choice1, id: "c1" },
        { ...data.choice2, id: "c2" },
        { ...data.choice3, id: "c3" },
      ]);
    } catch (err) {
      console.error(err);
    }
    finally{
      setLoadingChoices(false);
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
  sety(savedData.node.y + 1);
  setGameData(savedData);
  setCurrentStats(savedData.node.stats);

  const startNode = savedData.node;

  // Timeline is the character's full timeline
  const fullTimeline = savedData.character.timelineData.events;

  const updatedfulltimeline = (fullTimeline).map((ev) => {
    if (ev.id === startNode.id) {
      return {
        ...ev,
        branches: [ {branch:"new_branch"}]
      };
    }
    return ev;
  });
  
  setTimelineNodes(updatedfulltimeline);

  // Current event is the node saved in local storage
  
  setCurrentEvent(startNode);
  setname(savedData.character.name);
 
  // First fetch choices with current node from local storage
  fetchChoices(savedData.character.name,[], startNode);
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
      title: choice.title || "New Event",
      branch:"new_branch",
      branches: [],
      y: y,
      event: choice.event,
      stats: choice.new_stats ,
      personality: choice.new_personality,
    };
    sety(y+1);
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
    fetchChoices(name,newPreviousEvents, newEvent);
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
        {loadingChoices ? (
    <Fade transitionEnterDuration={500} transitionExitDuration={300}>
      <div
        style={{
          position: "fixed",
        height: "100%",
        width: "100%",
        top: "50%",  
        fontSize: "2rem",     
        fontWeight: "bold",
        color: "black",     // bright orange for visibility
        textAlign: "center",
        pointerEvents: "none",
        zIndex: 1000,         // on top of other elements
      }}
      >
        Loading choices...
      </div>
    </Fade>
  ) : (
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
                Current Personality:
                {currentEvent.personality}
              </p>
              Current Stats:
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
                key={choice.id || idx}
                className="k-card"
                onClick={() => handleChoiceClick(choice)}
              >
                {/* Everything inside one container */}
                <h4>{choice.title || "Choice"}</h4>
                <p>{choice.description || "No description provided"}</p>
                {choice.event && <small>{choice.event}</small>}
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
  )}
        {/* BACK FACE */}
        <div className="character-page-back">
          {flipType === "home" && <p>Going back home...</p>}
        </div>
      </div>
    </div>
  );
}
