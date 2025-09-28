import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Appbar from "../components/appbar";
import TimeLine from "../components/TimeLine/TimeLine";
import Book from "../components/Book/Book";
import "../styles/story_summary.css";
import { ProgressBar } from "@progress/kendo-react-progressbars";
import { Fade } from "@progress/kendo-react-animation";
import { savePlayerBook } from "../data/playerData"; // use your imported function

// Import timelines
import { caesarTimeline } from "../data/caesar";
import { gandhiTimeline } from "../data/gandhi";
import { lincolnTimeline } from "../data/lincoln";

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

// Sounds
const pageFlipSound = new Audio("/assets/page-flip.mp3");

// Characters master list
const characters = [
  {
    name: "Julius Caesar",
    era: "ancient-rome-era",
    img: "/assets/julius_caesar.png",
    timelineData: caesarTimeline,
  },
  {
    name: "Mahatma Gandhi",
    era: "modern-era",
    img: "/assets/mahatma_gandhi.png",
    timelineData: gandhiTimeline,
  },
  {
    name: "Abraham Lincoln",
    era: "industrial-revolution",
    img: "/assets/abraham_lincoln.png",
    timelineData: lincolnTimeline,
  },
];

export default function StorySummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { timelineData, characterName,personality,stats } = location.state || {};

  const [flipped, setFlipped] = useState(false);
  const [flipType, setFlipType] = useState(null);
  const [playerName, setPlayerName] = useState(""); // New state for player's name
  const [uploading, setUploading] = useState(false);

  if (!timelineData) {
    return (
      <div className="story-summary-container">
        <h2>No story data found. Play the game first.</h2>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  function getNewBranchTimeline(events = []) {
    if (!Array.isArray(events)) return [];
    const firstBranchIndex = events.findIndex(
      ev =>
        ev &&
        (ev.branch === "new_branch" ||
          (Array.isArray(ev.branches) && ev.branches.length > 0))
    );
    if (firstBranchIndex === -1) return events;
    const beforeBranch = events.slice(0, firstBranchIndex + 1);
    const newBranchEvents = events.filter(ev => ev.branch === "new_branch");
    return [...beforeBranch, ...newBranchEvents];
  }

  const characterObj = characters.find(
    c => c.name.toLowerCase() === (characterName || "").toLowerCase()
  );
  const bookEra = characterObj?.era || "unknown-era";
  const bookImg = characterObj?.img || "/assets/default.png";

  const goHome = () => {
    pageFlipSound.currentTime = 0;
    pageFlipSound.play();
    setFlipType("home");
    setFlipped(true);
    setTimeout(() => navigate("/"), 1200);
  };
  const newBranchEvents = getNewBranchTimeline(timelineData);
  const handleUpload = async () => {
    if (!playerName.trim()) {
      alert("Please enter your name");
      return;
    }
    setUploading(true);
    try {
      await savePlayerBook(playerName.trim(), newBranchEvents); // call imported function
      alert("Book uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  

  return (
    <div className="story-summary-container">
      <div className={`story-summary-book ${flipped ? "flipped" : ""}`}>
        {/* FRONT FACE */}
        <div className="story-summary-front">
          <Appbar title="Story Summary" onHomeClick={goHome} />

          <div className="Top">
            <div className="character-preview">
              <h2>Your Stats at the end of your timeline</h2>
              <img src={bookImg} alt={characterName} className="char-full-image" />
              <div className="personality-badge">
                <p>End Personality: {personality}</p>
              </div>
              End Stats:
              <StaggeredStats stats={stats} />
            
            </div>

            <div className="story-content">
              <h3>Your Timeline along with main timeline</h3>
              <TimeLine timelineData={{ events: timelineData }} />

              <h3>Your History</h3>
              <Book
                character={{
                  name: characterName,
                  era: bookEra,
                  img: bookImg,
                }}
                story={newBranchEvents}
              />

              {/* Player name input form */}
              <div className="player-name-form">
                <label htmlFor="playerName">Enter Your Name:</label>
                <input
                  type="text"
                  id="playerName"
                  value={playerName}
                  onChange={e => setPlayerName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
            </div>
          </div>

          <button
            className="upload-button"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Your Book"}
          </button>
        </div>

        {/* BACK FACE */}
        <div className="story-summary-back">
          {flipType === "home" && <p>Going back home...</p>}
        </div>
        </div>
      </div>
    
            );
}
