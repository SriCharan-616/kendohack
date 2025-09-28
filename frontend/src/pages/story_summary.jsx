import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Appbar from "../components/appbar";
import TimeLine from "../components/TimeLine/TimeLine";
import Book from "../components/Book/Book";
import "../styles/story_summary.css";
import { ProgressBar } from "@progress/kendo-react-progressbars";
import { Fade } from "@progress/kendo-react-animation";
import { Input, TextArea, Rating } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { savePlayerBook } from "../data/playerData";

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
          <div className="stat-bar-wrapper">
            <p>{stat.charAt(0).toUpperCase() + stat.slice(1)}: {value}</p>
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
  { name: "Julius Caesar", era: "ancient-rome-era", img: "/assets/julius_caesar.png", timelineData: caesarTimeline },
  { name: "Mahatma Gandhi", era: "modern-era", img: "/assets/mahatma_gandhi.png", timelineData: gandhiTimeline },
  { name: "Abraham Lincoln", era: "industrial-revolution", img: "/assets/abraham_lincoln.png", timelineData: lincolnTimeline },
];

export default function StorySummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { timelineData, characterName, personality, stats } = location.state || {};

  const [flipped, setFlipped] = useState(false);
  const [flipType, setFlipType] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [playerReview, setPlayerReview] = useState("");
  const [playerRating, setPlayerRating] = useState(0);
  const [uploading, setUploading] = useState(false);

  if (!timelineData) {
    return (
      <div className="story-summary-container">
        <h2>No story data found. Play the game first.</h2>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  const getNewBranchTimeline = (events = []) => {
    if (!Array.isArray(events)) return [];
    const firstBranchIndex = events.findIndex(ev =>
      ev && (ev.branch === "new_branch" || (Array.isArray(ev.branches) && ev.branches.length > 0))
    );
    if (firstBranchIndex === -1) return events;
    const beforeBranch = events.slice(0, firstBranchIndex + 1);
    const newBranchEvents = events.filter(ev => ev.branch === "new_branch");
    return [...beforeBranch, ...newBranchEvents];
  };

  const characterObj = characters.find(c => c.name.toLowerCase() === (characterName || "").toLowerCase());
  const bookEra = characterObj?.era || "unknown-era";
  const bookImg = characterObj?.img || "/assets/default.png";
  const newBranchEvents = getNewBranchTimeline(timelineData);

  const goHome = () => {
    pageFlipSound.currentTime = 0;
    pageFlipSound.play();
    setFlipType("home");
    setFlipped(true);
    setTimeout(() => navigate("/"), 1200);
  };

  const handleUpload = async () => {
    if (!playerName.trim()) { alert("Please enter your name"); return; }
    setUploading(true);
    console.log(characterName);
    try {
      await savePlayerBook(playerName.trim(), newBranchEvents,characterName); // call imported function
      setFlipType("upload");
      setFlipped(true);
        setTimeout(() => navigate(`/player-books`),1200);
    } catch (err) {
      console.error(err);
      
    } finally { setUploading(false); }
  };

  return (
    <div className="story-summary-container">
      <div className={`story-summary-book ${flipped ? "flipped" : ""}`}>
        <div className="story-summary-front">
          <Appbar title="Story Summary" onHomeClick={goHome} />

          <div className="Top">
            <div className="character-preview">
              <h2>Your Stats at the end of your timeline</h2>
              <img src={bookImg} alt={characterName} className="char-full-image" />
              <div className="personality-badge">
                <p>End Personality: {personality}</p>
              </div>

              <StaggeredStats stats={stats} />

              {/* Player Name Input, Review, Rating, Upload */}
              <Fade transitionEnterDuration={500}>
                <div className="player-upload-container">
                  <label htmlFor="playerName" className="player-name-label">Enter Your Name:</label>
                  <Input
                    id="playerName"
                    value={playerName}
                    onChange={e => setPlayerName(e.value)}
                    placeholder="Your name"
                    className="player-name-input"
                  />

                  <label htmlFor="playerReview" className="player-review-label">Write a Review:</label>
                  <TextArea
                    id="playerReview"
                    value={playerReview}
                    onChange={e => setPlayerReview(e.value)}
                    placeholder="Share your thoughts about your story..."
                    className="player-review-input"
                    rows={4}
                  />

                  <label className="player-rating-label">Rate your story:</label>
                  <Rating
                    value={playerRating}
                    onChange={e => setPlayerRating(e.value)}
                    max={5}
                    className="player-rating"
                  />

                  <Button
                    themeColor="primary"
                    look="outline"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="upload-button"
                  >
                    {uploading ? "Uploading..." : "Upload Your Book"}
                  </Button>
                </div>
              </Fade>
            </div>

            <div className="story-content">
              <h3>Your Timeline along with main timeline</h3>
              <TimeLine timelineData={{ events: timelineData }} />

              <h3>Your History</h3>
              <Book
                character={{ name: characterName, era: bookEra, img: bookImg }}
                story={newBranchEvents}
              />
            </div>
          </div>
        </div>

        <div className="story-summary-back">
          {flipType === "home" && <p>Going back home...</p>}
          {flipType === "upload" && <p>File uploaded. Going to books...</p>}
        </div>
      </div>
    </div>
  );
}
