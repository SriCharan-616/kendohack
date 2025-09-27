import { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@progress/kendo-react-buttons";
import { Fade, Slide } from "@progress/kendo-react-animation";
import { ProgressBar } from "@progress/kendo-react-progressbars";
import "../styles/character_profile.css";
import Appbar from "../components/appbar";

// Components
import TimeLine from "../components/TimeLine/TimeLine";
import Book from "../components/Book/Book";

// Import timelines for all characters
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
  const [lastClickedNode, setLastClickedNode] = useState(null);
  const [flipped, setFlipped] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const char = characters.find(c => c.name.toLowerCase() === characterName.toLowerCase());
    if (!char) return;

    const lastEvent = char.timelineData.events[char.timelineData.events.length - 1];
    setSelectedChar({
      ...char,
      stats: lastEvent.stats,
      timeline: lastEvent.y
    });
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

  const handleNodeClick = (nodeId) => {
    if (lastClickedNode === nodeId) {
      pageFlipSound.currentTime = 0;
      pageFlipSound.play();
      setFlipped(true);
      setTimeout(() => navigate(`/game/${selectedChar.name}`), 1200);
    } else {
      setLastClickedNode(nodeId);
      playClickSound();
    }
  };

  if (!selectedChar) return <p style={{ padding: "2rem" }}>Character not found!</p>;

  return (
    <div className={`character-page ${flipped ? "flipped" : ""}`}>
      <Appbar title="Play Page" />

      {/* Top Row: Character Preview & Book */}
      <div className="Top" >
        <div className="character-preview">
          <h2>{selectedChar.name} ({toTitleCase(selectedChar.era)})</h2>
          <img src={selectedChar.img} alt={selectedChar.name} className="char-full-image" />
          <StaggeredStats stats={selectedChar.stats} timeline={selectedChar.timeline} />
          <Button
            style={{ marginTop: "1rem", fontWeight: "bold" }}
            onClick={() => navigate(`/game/${selectedChar.name}`)}
          >
            Start Game
          </Button>
        </div>

        <div style={{ flex: 1, maxWidth: "700px" }}>
          <h3 style={{ marginBottom: "1rem" }}>{selectedChar.name} Chronicles</h3>
          <Book
            character={selectedChar}
            story={selectedChar.timelineData.events}
            onNodeClick={handleNodeClick}
          />
        </div>
      </div>

      {/* Bottom Row: Timeline with scrollbar */}
      <div style={{ padding: "2rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Interactive Timeline</h3>
        <div style={{ overflowX: "auto", paddingBottom: "1rem" }}>
          <TimeLine
            events={selectedChar.timelineData.events}
            onNodeClick={handleNodeClick}
          />
        </div>
      </div>
    </div>
  );
}
