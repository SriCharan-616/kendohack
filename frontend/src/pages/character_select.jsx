import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
  Card,
  CardHeader,
  CardTitle,
  CardBody
} from "@progress/kendo-react-layout";
import { Button, DropDownButton } from "@progress/kendo-react-buttons";
import { Fade, Slide } from "@progress/kendo-react-animation";
import "../styles/character_select.css";


const characters = [
  {
    name: "Arthur",
    era: "medieval-era",
    img: "/assets/arthur.png",
    stats: { strength: 85, intelligence: 70, agility: 75 },
    timeline: 60
  },
  {
    name: "Cleopatra",
    era: "ancient-rome-era",
    img: "/assets/cleopatra.png",
    stats: { strength: 60, intelligence: 95, agility: 80 },
    timeline: 50
  },
  {
    name: "Leonardo",
    era: "renaissance-era",
    img: "/assets/leonardo.png",
    stats: { strength: 55, intelligence: 98, agility: 65 },
    timeline: 70
  },
  {
    name: "Abraham Lincoln",
    era: "industrial-era",
    img: "/assets/lincoln.png",
    stats: { strength: 70, intelligence: 88, agility: 60 },
    timeline: 75
  },
  {
    name: "Gandhi",
    era: "modern-era",
    img: "/assets/gandhi.png",
    stats: { strength: 35, intelligence: 94, agility: 55 },
    timeline: 85
  },
  {
    name: "Julius Caesar",
    era: "ancient-rome-era",
    img: "/assets/caesar.png",
    stats: { strength: 90, intelligence: 85, agility: 72 },
    timeline: 55
  }
];


const clickSound = new Audio("/assets/click.mp3");

export default function CharacterSelectPage() {
  const { eraSlug } = useParams();
  const navigate = useNavigate();
  const bgAudioRef = useRef(new Audio("/assets/bg2.mp3"));
  const [musicOn, setMusicOn] = useState(true);

  // Filter characters by eraSlug
  const filteredChars = characters.filter(
    (char) => char.era.toLowerCase() === eraSlug
  );

  // Auto-select first character
  const [selectedChar, setSelectedChar] = useState(filteredChars[0] || null);

  useEffect(() => {
    if (filteredChars.length > 0) setSelectedChar(filteredChars[0]);
    else setSelectedChar(null);
  }, [eraSlug]);

  // Background music setup
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

  const handleSelectCharacter = (char) => {
    playClickSound();
    setSelectedChar(char);
  };

  return (
    <div className="character-page">
      {/* App Bar */}
      <AppBar className="app-bar">
        <AppBarSection>
          <h2>Character Selection</h2>
        </AppBarSection>
        <AppBarSpacer />
        <AppBarSection style={{ display: "flex", gap: "0.5rem" }}>
          <Button
            className={`music-button ${musicOn ? "pulse" : "pulse-flip"}`}
            onClick={() => setMusicOn(prev => !prev)}
          >
            {musicOn ? "🔉 Music" : "🔇 Music"}
          </Button>
          <DropDownButton
            className="music-dropdown"
            text={"Change Track"}
            items={[{
              text: "Medieval Tune",
              onClick: () => {
                playClickSound();
                bgAudioRef.current.src = "/assets/bg2.mp3";
                bgAudioRef.current.play();
                setMusicOn(true);
              }
            }]}
            popupSettings={{ className: "custom-music-dropdown-popup" }}
          />
        </AppBarSection>
      </AppBar>

      {/* Content container */}
      <div className="character-select-container">
        <div className="character-select-main">
          
          {/* Character List */}
          <div className="character-list">
            {filteredChars.map((char, idx) => (
              <Fade key={idx}>
                <Card
                  className={`hero-card ${selectedChar?.name === char.name ? "selected" : ""}`}
                  onClick={() => handleSelectCharacter(char)}
                >
                  <CardHeader>
                    <CardTitle>{char.name}</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <img src={char.img} alt={char.name} className="char-thumbnail" />
                    <p>{char.era.replace(/-/g, " ")} Era</p>
                  </CardBody>
                </Card>
              </Fade>
            ))}
          </div>

          {/* Character Preview */}
          {selectedChar && (
            <Slide direction="end" in={true}>
              <Fade in={true}>
                <div className="character-preview">
                  <h2>{selectedChar.name} ({selectedChar.era.replace(/-/g, " ")} Era)</h2>
                  <img src={selectedChar.img} alt={selectedChar.name} className="char-full-image" />

                  {/* Stats */}
                  <div className="character-stats">
                    {Object.entries(selectedChar.stats).map(([stat, value]) => (
                      <div className="stat-bar-wrapper" key={stat}>
                        <p>{stat.charAt(0).toUpperCase() + stat.slice(1)}: {value}</p>
                        <div className="stat-bar">
                          <div className="stat-fill" style={{ width: `${value}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Timeline */}
                  <div className="timeline-section">
                    <p>Timeline Progress: {selectedChar.timeline}%</p>
                    <div className="stat-bar">
                      <div className="stat-fill timeline-fill" style={{ width: `${selectedChar.timeline}%` }}></div>
                    </div>
                  </div>

                  <Button
                    style={{ marginTop: "1rem", fontWeight: "bold" }}
                    onClick={() => navigate(`/play/${selectedChar.name.toLowerCase()}`)}
                  >
                    Enter Game
                  </Button>
                </div>
              </Fade>
            </Slide>
          )}

        </div>
      </div>
    </div>
  );
}
