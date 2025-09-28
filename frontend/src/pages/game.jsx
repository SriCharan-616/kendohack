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
  const [flipped, setFlipped] = useState(false);
  const [flipType, setFlipType] = useState(null);
  const [loadingChoices, setLoadingChoices] = useState(false);
  const [y, sety] = useState(0);

  // NEW: choices + current event
  const [choices, setChoices] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [previousEvents, setPreviousEvents] = useState([]);
  const [name, setname] = useState("");
  const [end, setend] = useState(0);

  // Animate node for timeline branch creation
  const [animatingNode, setAnimatingNode] = useState(null);

  // Fetch choices
  const fetchChoices = async (name, prevEvents, currEvent,pend) => {
    console.log("Fetching choices for event:", currEvent);
    setLoadingChoices(true);

    // derive eventNumber and maxEvents from timelineNodes
    const eventNumber = currEvent.y;
    const aend = end == 0?pend:end
    // current stats/personality/timePeriod/age from currentEvent
    const currentStats = currEvent.stats;
    const currentPersonality = currEvent.personality;
    const timePeriod = currEvent.date;
    const characterAge = currEvent.age;
    console.log(end)
    try {
      const res = await fetch("http://localhost:5000/get-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          currentEvent: currEvent,
          previousEvents: prevEvents,
          currentStats,
          currentPersonality,
          eventNumber,
          maxEvents:aend,
          timePeriod,
          characterAge,
        }),
      });

      const data = await res.json();
      setChoices([
        { ...data.choice1, id: "c1" },
        { ...data.choice2, id: "c2" },
        { ...data.choice3, id: "c3" },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingChoices(false);
    }
  };

  // Load character and first event
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("selectedCharacterNode"));
    if (!savedData) {
      navigate("/");
      return;
    }

    sety(savedData.node.y + 1);
    setGameData(savedData);
    setCurrentStats(savedData.node.stats);

    const startNode = savedData.node;
    const fullTimeline = savedData.character.timelineData.events;
    setend(fullTimeline.length);
    const updatedfulltimeline = fullTimeline.map((ev) =>
      ev.id === startNode.id ? { ...ev, branches: [{ branch: "new_branch" }] } : ev
    );

    setTimelineNodes(updatedfulltimeline);
    setCurrentEvent(startNode);
    setname(savedData.character.name);
    

    fetchChoices(savedData.character.name, [], startNode,fullTimeline.length);
  }, [navigate]);

  if (!gameData) return null;

  const { character } = gameData;

  // Handle choice click with timeline branch animation
  const handleChoiceClick = (choice) => {
    
    if (end === y) {
      pageFlipSound.currentTime = 0;
      pageFlipSound.play();
      setFlipType("player-book");
      setFlipped(true);
      setTimeout(
        () => navigate('/story-summary',{ 
      state: { timelineData: timelineNodes, characterName: name } 
    }),
        1200
      );
      return;
    }

    const newPreviousEvents = [...previousEvents, currentEvent];
    setPreviousEvents(newPreviousEvents);

    const newEvent = {
      id: timelineNodes.length + 1,
      title: choice.title,
      branch: "new_branch",
      branches: [],
      y: y,
      date: choice.new_year,
      age: choice.new_age,
      event: choice.event,
      stats: choice.new_stats,
      personality: choice.new_personality,
    };

    
    sety(y + 1);
    setAnimatingNode(newEvent);

    successSound.currentTime = 0;
    successSound.volume = 0.5;
    successSound.play();

    // Animate timeline branch appearing
    let step = 0;
    const steps = 20; // total frames for animation
    const interval = setInterval(() => {
      step++;
      if (step >= steps) {
        // Finish animation
        setTimelineNodes([...timelineNodes, newEvent]);
        setCurrentEvent(newEvent);
        setCurrentStats(newEvent.stats);
        setAnimatingNode(null);
        fetchChoices(name, newPreviousEvents, newEvent,timelineNodes.length);
        clearInterval(interval);
      } else {
        // Show animating placeholder node
        setTimelineNodes([...timelineNodes, { ...newEvent, placeholder: true }]);
      }
    }, 50);
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
      {/* Add loading class to character-page-book while fetching choices */}
      <div
        className={`character-page-book ${flipped ? "flipped" : ""} ${
          loadingChoices ? "loading" : ""
        }`}
      >
        {/* FRONT FACE */}
        <div className="character-page-front">
          <Appbar title="Game Page" onHomeClick={goHome} />

          <div className="Top">
            {/* Character Preview */}
            <div
              className={`character-preview ${
                loadingChoices ? "loading-preview" : ""
              }`}
              style={{ marginTop: "2rem" }}
            >
              <h2>{character.name}</h2>
              <img
                src={character.img}
                alt={character.name}
                className={`char-full-image ${
                  loadingChoices ? "loading-image" : ""
                }`}
              />
              <div className="personality-badge">
                <p>Current Personality: {currentEvent.personality}</p>
              </div>
              Current Stats:
              <StaggeredStats stats={currentStats} />
            </div>

            {/* Timeline */}
            <div>
              <h3>Timeline</h3>
              <TimeLine timelineData={{ events: timelineNodes }} animatingNode={animatingNode} />
            </div>
          </div>

          {/* Current Event */}
          {currentEvent && (
            <div className={`current-event-card ${loadingChoices ? "loading-card" : ""}`}>
              <h4>{currentEvent.title}</h4>
              <p>{currentEvent.event || ""}</p>
              <p>What's Next?</p>
            </div>
          )}

          {/* Choice Cards */}
          <div className="choice-cards">
            {choices.map((choice, idx) => (
              <div
                key={choice.id || idx}
                className={`k-card ${loadingChoices ? "loading-card-spin" : ""}`}
                onClick={() => handleChoiceClick(choice)}
              >
                <h4>{choice.title || "Choice"}</h4>
                <p>{choice.description || "No description provided"}</p>
                {choice.event && <small>{choice.event}</small>}
              </div>
            ))}
          </div>
        </div>

        {/* BACK FACE */}
        <div className="character-page-back">
          {flipType === "player-book" && (
            <p className="era">Your story has ended...</p>
          )}
          {flipType === "home" && (
            <p className="goback">Going back home...</p>
          )}
        </div>
      </div>
    </div>
  );
}
