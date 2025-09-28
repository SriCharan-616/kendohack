import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Appbar from "../components/appbar";
import TimeLine from "../components/TimeLine/TimeLine";
import Book from "../components/Book/Book";
import "../styles/story_summary.css";

// Sounds
const pageFlipSound = new Audio("/assets/page-flip.mp3");

export default function StorySummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { timelineData, characterName, characterImg, characterEra } = location.state || {};

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
          character: { name: characterName, era: characterEra, img: characterImg },
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

  return (
    <div className="story-summary-container">
      <div className={`story-summary-book ${flipped ? "flipped" : ""}`}>
        {/* FRONT FACE */}
        <div className="story-summary-front">
          <Appbar title="Story Summary" onHomeClick={goHome} />

          <div className="Top">
            <div className="character-preview">
              <h2>{characterName}'s Story</h2>
              <img src={characterImg} alt={characterName} className="char-full-image" />
            </div>

            <div className="story-content">
              <h3>Timeline</h3>
              <TimeLine timelineData={{ events: timelineData.events }} />

              <h3>Book</h3>
              <Book
                character={{ name: characterName, era: characterEra, img: characterImg }}
                story={timelineData.events}
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
