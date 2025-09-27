import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AppBar,
  AppBarSection,
  AppBarSpacer
} from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { Fade, Slide } from "@progress/kendo-react-animation";
import { ProgressBar } from "@progress/kendo-react-progressbars";
import "../styles/character_profile.css"; // reuse same CSS

const characters = [
  { name: "Arthur", era: "medieval-era", img: "/assets/arthur.png", stats: { strength: 85, intelligence: 70, agility: 75 }, timeline: 60 },
  { name: "Cleopatra", era: "ancient-rome-era", img: "/assets/cleopatra.png", stats: { strength: 60, intelligence: 95, agility: 80 }, timeline: 50 },
  { name: "Leonardo", era: "renaissance-era", img: "/assets/leonardo.png", stats: { strength: 55, intelligence: 98, agility: 65 }, timeline: 70 },
  { name: "Abraham Lincoln", era: "industrial-era", img: "/assets/lincoln.png", stats: { strength: 70, intelligence: 88, agility: 60 }, timeline: 75 },
  { name: "Gandhi", era: "modern-era", img: "/assets/gandhi.png", stats: { strength: 35, intelligence: 94, agility: 55 }, timeline: 85 },
  { name: "Julius Caesar", era: "ancient-rome-era", img: "/assets/caesar.png", stats: { strength: 90, intelligence: 85, agility: 72 }, timeline: 55 }
];

const clickSound = new Audio("/assets/click.mp3");

function toTitleCase(str) {
  return str
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

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
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return <ProgressBar value={fill} label={false} />;
};

const StaggeredStats = ({ stats, timeline }) => {
  const statEntries = Object.entries(stats);
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
      <div className="timeline-section" style={{ marginTop: "1rem" }}>
        <p>Timeline Progress: {timeline}%</p>
        <AnimatedStat value={timeline} delay={statEntries.length * 300} />
      </div>
    </div>
  );
};

export default function CharacterProfile() {
  const { characterName } = useParams();
  const [selectedChar, setSelectedChar] = useState(null);
  const bgAudioRef = useRef(new Audio("/assets/bg2.mp3"));
  const [musicOn, setMusicOn] = useState(true);

  // Load only the previously selected character
  useEffect(() => {
    const char = characters.find(c => c.name.toLowerCase() === characterName.toLowerCase());
    if (char) setSelectedChar(char);
  }, [characterName]);

  useEffect(() => {
    const audio = bgAudioRef.current;
    audio.loop = true;
    audio.volume = 0.2;
    if (musicOn) audio.play().catch(console.log);
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    const audio = bgAudioRef.current;
    if (musicOn) audio.play().catch(console.log);
    else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [musicOn]);

  const playClickSound = () => {
    clickSound.currentTime = 0;
    clickSound.play();
  };

  if (!selectedChar) return <p style={{ padding: "2rem" }}>Character not found!</p>;

  return (
    <div className="character-page">
      {/* Navbar */}
      <AppBar className="app-bar">
        <AppBarSection>
          <h2>Play Page</h2>
        </AppBarSection>
        <AppBarSpacer />
        <AppBarSection style={{ display: "flex", gap: "0.5rem" }}>
          <Button
            className={`music-button ${musicOn ? "pulse" : "pulse-flip"}`}
            onClick={() => setMusicOn(prev => !prev)}
          >
            {musicOn ? "🔉 Music" : "🔇 Music"}
          </Button>
        </AppBarSection>
      </AppBar>

      {/* Character Preview Left-Aligned */}
      <div className="character-select-container" style={{ justifyContent: "flex-start" }}>
        <Slide direction="start" in={true}>
          <Fade in={true}>
            <div className="character-preview" style={{ marginLeft: "2rem" }}>
              <h2>{selectedChar.name} ({toTitleCase(selectedChar.era)})</h2>
              <img src={selectedChar.img} alt={selectedChar.name} className="char-full-image" />
              <StaggeredStats stats={selectedChar.stats} timeline={selectedChar.timeline} />
              <Button
                style={{ marginTop: "1rem", fontWeight: "bold" }}
                onClick={playClickSound}
              >
                Start Game
              </Button>
            </div>
          </Fade>
        </Slide>
      </div>
    </div>
  );
}
