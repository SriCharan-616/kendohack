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
import { Fade } from "@progress/kendo-react-animation";
import "../styles/era_select.css";

import parchmentIcon from "/assets/parchment-icon.png";
import romeImage from "/assets/rome.png";
import industrialImage from "/assets/industrial.png";
import modernImage from "/assets/modern.png";

// Sounds
const clickSound = new Audio("/assets/click.mp3");

// Background music list
const musicList = [
  { text: "Medieval Tune", file: "/assets/bg2.mp3" },
  { text: "Ancient Melody", file: "/assets/bg_ancient.mp3" },
  { text: "Renaissance Song", file: "/assets/bg_renaissance.mp3" }
];

const FadeOnScroll = ({ children }) => {
  const ref = useRef();
  const [visible, setVisible] = useState(true); // always visible

  return (
    <div ref={ref} className="story-card">
      <Fade>
        <div
          style={{
            opacity: visible ? 1 : 1,
            transition: "opacity 0.6s ease-in-out"
          }}
        >
          {children}
        </div>
      </Fade>
    </div>
  );
};

const EraSelectPage = () => {
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const bgAudioRef = useRef(new Audio(musicList[0].file));

  /* --- Music Handling --- */
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

  const toggleMusic = () => {
    playClickSound();
    setMusicOn((prev) => !prev);
  };

  const changeMusic = (file) => {
    const audio = bgAudioRef.current;
    audio.pause();
    audio.currentTime = 0;
    audio.src = file;
    audio.play().catch(console.log);
    setMusicOn(true);
  };

  /* --- Data --- */
  const eras = [
  {
    name: "Ancient Rome Era",
    years: "27 BC - 476 AD",
    description:
      "Step into the sandals of Caesar, walk the marble halls, and command legions of the eternal city.",
    img: romeImage,
    className: "ancient-rome-card",
    buttonColor: "var(--highlight)",
    decoration: "🌿"
  },
  {
    name: "Medieval Era",
    years: "500 - 1500",
    description:
      "Experience the age of knights, castles, and epic legends that shaped kingdoms across Europe.",
    img: "/assets/medieval.png", // make sure you have this image
    className: "medieval-era-card",
    buttonColor: "var(--secondary)",
    decoration: "🛡️"
  },
  {
    name: "Renaissance Era",
    years: "1400 - 1600",
    description:
      "Dive into the rebirth of art, science, and culture as human creativity reaches new heights.",
    img: "/assets/renaissance.png", // make sure you have this image
    className: "renaissance-era-card",
    buttonColor: "var(--primary)",
    decoration: "🎨"
  },
  {
    name: "Industrial Revolution",
    years: "1800 - 1900",
    description:
      "Witness the rise of steam and steel, lead nations through industrial transformation.",
    img: industrialImage,
    className: "industrial-era-card",
    buttonColor: "var(--secondary)",
    decoration: "⚙️"
  },
  {
    name: "Modern Era",
    years: "1900 - 2000",
    description:
      "Navigate through world wars, technological revolutions, and the most transformative century.",
    img: modernImage,
    className: "modern-era-card",
    buttonColor: "var(--primary)",
    decoration: "💡"
  }
];


  return (
    <div className="homepage-container">
      <div className={`homepage-book ${flipped ? "flipped" : ""}`}>
        {/* --- FRONT PAGE --- */}
        <div className="homepage-front">
          <AppBar className="k-appbar">
            <AppBarSection>
              <h2>Era Selection</h2>
            </AppBarSection>
            <AppBarSection style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                className={`music-button ${musicOn ? "pulse" : "pulse-flip"}`}
                onClick={toggleMusic}
              >
                {musicOn ? "🔉 Music" : "🔇 Music"}
              </Button>

              <DropDownButton
                className="music-dropdown"
                text="⋮"
                icon={
                  <img
                    src={parchmentIcon}
                    alt="parchment"
                    className="parchment-icon"
                  />
                }
                items={musicList.map((m) => ({
                  text: m.text,
                  onClick: () => {
                    playClickSound();
                    changeMusic(m.file);
                  }
                }))}
                popupSettings={{ className: "custom-music-dropdown-popup" }}
              />
            </AppBarSection>
          </AppBar>
          <AppBarSpacer />

          <div className="manuscript-content-centered">
            <header className="manuscript-header">
              <div className="center-ornament">◆</div>
              <h1>Select the era you want to explore</h1>
            </header>

            {eras.map((era, idx) => (
              <FadeOnScroll key={idx}>
                <Card className={`era-card ${era.className}`}>
                  <div className="card-content-wrapper">
                    <div className="card-text-section">
                      <CardHeader>
                        <CardTitle>
                          {era.name} ({era.years})
                        </CardTitle>
                      </CardHeader>
                      <CardBody>
                        <p>{era.description}</p>
                        <Button
                          style={{
                            background: era.buttonColor,
                            color: "var(--background)",
                            fontWeight: "bold"
                          }}
                          onClick={() => {
                            playClickSound();
                            setFlipped(true);
                            const eraSlug = era.name.toLowerCase().replace(/\s+/g, '-'); // e.g., "Ancient Rome Era" → "ancient-rome-era"
                            setTimeout(() => navigate(`/characters/${eraSlug}`), 1200);
                          }}
                        >
                          Explore {era.name.split(" ")[0]}
                        </Button>
                      </CardBody>
                    </div>
                    <div className="card-image-section">
                      <img
                        src={era.img}
                        alt={era.name}
                        className="era-image"
                      />
                      <div className="card-decorations">
                        <span
                          className={
                            era.className === "ancient-rome-card"
                              ? "laurel-wreath"
                              : era.className === "industrial-era-card"
                              ? "gear"
                              : "tech-icon"
                          }
                          style={{
                            fontSize: "3rem",
                            lineHeight: 1,
                            display: "inline-block",
                            transform: "translateY(-15%)",
                            transition: "transform 0.3s ease, color 0.3s ease",
                            cursor: "pointer"
                          }}
                        >
                          {era.decoration}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </FadeOnScroll>
            ))}
          </div>
        </div>

        {/* --- BACK PAGE --- */}
        <div className="homepage-back">
          <h1>You are entering an Era...</h1>
        </div>
      </div>
    </div>
  );
};

export default EraSelectPage;
