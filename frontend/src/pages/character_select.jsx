import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

import parchmentIcon from "/assets/parchment-icon.png";

const characters = [
  {
    name: "Arthur",
    era: "Medieval",
    img: "/assets/arthur.png",
    stats: { strength: 85, intelligence: 70, agility: 75 },
    timeline: 60
  },
  {
    name: "Cleopatra",
    era: "Ancient",
    img: "/assets/cleopatra.png",
    stats: { strength: 60, intelligence: 95, agility: 80 },
    timeline: 50
  },
  {
    name: "Leonardo",
    era: "Renaissance",
    img: "/assets/leonardo.png",
    stats: { strength: 55, intelligence: 98, agility: 65 },
    timeline: 70
  }
];

const clickSound = new Audio("/assets/click.mp3");

export default function CharacterSelectPage() {
  const navigate = useNavigate();
  const [selectedChar, setSelectedChar] = useState(characters[0]);
  const [musicOn, setMusicOn] = useState(true);
  const bgAudioRef = useRef(new Audio("/assets/bg2.mp3"));

  // Music handling
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
    <div className="homepage-container">
      <div className="character-select-container">

        <AppBar className="k-appbar">
          <AppBarSection><h2>Character Selection</h2></AppBarSection>
          <AppBarSection style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              className={`music-button ${musicOn ? "pulse" : "pulse-flip"}`}
              onClick={() => setMusicOn(prev => !prev)}
            >
              {musicOn ? "🔉 Music" : "🔇 Music"}
            </Button>
            <DropDownButton
              className="music-dropdown"
              text={<img src={parchmentIcon} alt="parchment" className="parchment-icon"/>}
              items={[
                { text: "Medieval Tune", onClick: () => { playClickSound(); bgAudioRef.current.src="/assets/bg2.mp3"; bgAudioRef.current.play(); setMusicOn(true);} }
              ]}
              popupSettings={{ className: "custom-music-dropdown-popup" }}
            />
          </AppBarSection>
        </AppBar>
        <AppBarSpacer />

        <div className="character-select-main">

          {/* --- Character List --- */}
          <div className="character-list">
            {characters.map((char, idx) => (
              <Card
                key={idx}
                className={`hero-card ${selectedChar.name === char.name ? "selected" : ""}`}
                onClick={() => handleSelectCharacter(char)}
              >
                <CardHeader>
                  <CardTitle>{char.name}</CardTitle>
                </CardHeader>
                <CardBody>
                  <img src={char.img} alt={char.name} className="char-thumbnail"/>
                  <p>{char.era} Era</p>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* --- Character Preview --- */}
          <Slide direction="end" in={true}>
            <Fade in={true}>
              <div className="character-preview">
                <h2>{selectedChar.name} ({selectedChar.era} Era)</h2>
                <img src={selectedChar.img} alt={selectedChar.name} className="char-full-image"/>
                
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
              </div>
            </Fade>
          </Slide>

        </div>
      </div>
    </div>
  );
}
