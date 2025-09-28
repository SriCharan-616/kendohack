import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Appbar from "../components/appbar";
import TimeLine from "../components/TimeLine/TimeLine";
import Book from "../components/Book/Book";
import "../styles/story_summary.css";

// Import timelines
import { caesarTimeline } from "../data/caesar";
import { gandhiTimeline } from "../data/gandhi";
import { lincolnTimeline } from "../data/lincoln";

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
  const { timelineData, characterName } = location.state || {};
console.log(timelineData)
  const [flipped, setFlipped] = useState(false);
  const [flipType, setFlipType] = useState(null);
  const [uploading, setUploading] = useState(false);

  if (!timelineData) {
    return (
      <div className="story-summary-container">
        <h2>No story data found. Play the game first.</h2>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }
  console.log(timelineData);
  // This function will create your “new branch” timeline
function getNewBranchTimeline(events = []) {
  if (!Array.isArray(events)) return [];

  // 1️⃣ Find the first event that begins branching.
  //    It can be either:
  //    - branches array is not empty, or
  //    - branch field equals 'new_branch'
  const firstBranchIndex = events.findIndex(
    ev =>
      ev &&
      (ev.branch === 'new_branch' ||
        (Array.isArray(ev.branches) && ev.branches.length > 0))
  );
  console.log(firstBranchIndex);
  if (firstBranchIndex === -1) {
    // No branching found → return all events
    return events;
  }

  // 2️⃣ Include all events up to that index
  const beforeBranch = events.slice(0, firstBranchIndex + 1);

  // 3️⃣ Include all events whose branch === 'new_branch'
  const newBranchEvents = events.filter(ev => ev.branch === 'new_branch');

  // 4️⃣ Combine
  return [...beforeBranch, ...newBranchEvents];
}

  // 🔹 Look up era + img for Book component only
  const characterObj = characters.find(
    (c) => c.name.toLowerCase() === (characterName || "").toLowerCase()
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

  const handleUpload = async () => {
    setUploading(true);
    try {
      const res = await fetch("http://localhost:5000/upload-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character: {
            name: characterName,
            era: bookEra,
            img: bookImg,
          },
          story: timelineData.events,
        }),
      });
      const data = await res.json();
      alert("Book uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };
  
  const newBranchEvents = getNewBranchTimeline(timelineData);
  
  return (
    <div className="story-summary-container">
      <div className={`story-summary-book ${flipped ? "flipped" : ""}`}>
        {/* FRONT FACE */}
        <div className="story-summary-front">
          <Appbar title="Story Summary" onHomeClick={goHome} />

          <div className="Top">
            <div className="character-preview">
              <h2>{characterName}'s Story</h2>
              <img src={bookImg} alt={characterName} className="char-full-image" />
            </div>

            <div className="story-content">
              <h3>Timeline</h3>
              <TimeLine timelineData={{ events: timelineData }} />

              <h3>Book</h3>
              <Book
                character={{
                  name: characterName,
                  era: bookEra,
                  img: bookImg,
                }}
                story={newBranchEvents}
              />
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
