import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody
} from "@progress/kendo-react-layout";
import { Fade, Slide } from "@progress/kendo-react-animation";
import { Button } from "@progress/kendo-react-buttons";
import "../styles/character_select.css";
import Appbar from "../components/appbar";

const characters = [
  { name: "Arthur", era: "medieval-era", img: "/assets/arthur.png", fact: "Arthur is the legendary king of Britain, known for the Knights of the Round Table and Excalibur." },
  { name: "Cleopatra", era: "ancient-rome-era", img: "/assets/cleopatra.png", fact: "Cleopatra VII was the last active ruler of the Ptolemaic Kingdom of Egypt and was known for her intelligence and charm." },
  { name: "Leonardo", era: "renaissance-era", img: "/assets/leonardo.png", fact: "Leonardo da Vinci was a polymath of the Renaissance, excelling in art, science, and engineering." },
  { name: "Abraham Lincoln", era: "industrial-revolution", img: "/assets/lincoln.png", fact: "Abraham Lincoln was the 16th President of the United States and led the country during the Civil War." },
  { name: "Mahatma Gandhi", era: "modern-era", img: "/assets/gandhi.png", fact: "Mahatma Gandhi led India to independence using nonviolent civil disobedience." },
  { name: "Julius Caesar", era: "ancient-rome-era", img: "/assets/caesar.png", fact: "Julius Caesar was a Roman general and statesman who played a critical role in the demise of the Roman Republic." }
];

const clickSound = new Audio("/assets/click.mp3");

export default function CharacterSelectPage() {
  const { eraSlug } = useParams();
  const navigate = useNavigate();
  
  const filteredChars = characters.filter(
    (char) => char.era.toLowerCase() === eraSlug
  );

  const [selectedChar, setSelectedChar] = useState(filteredChars[0] || null);

  useEffect(() => {
    if (filteredChars.length > 0) setSelectedChar(filteredChars[0]);
    else setSelectedChar(null);
  }, [eraSlug]);

  const playClickSound = () => {
    clickSound.currentTime = 0;
    clickSound.play();
  };

  const handleSelectCharacter = (char) => {
    playClickSound();
    setSelectedChar(char);
  };

  const formatEra = (era) =>
    era
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <div className="character-page">
      <Appbar title="Character Selection" />

      <div className="character-select-container">
        <div className="character-select-main">

          {/* Character List */}
          <div className="character-list">
            {filteredChars.map((char) => (
              <Fade key={char.name}>
                <Card
                  className={`hero-card ${selectedChar?.name === char.name ? "selected" : ""}`}
                  onClick={() => handleSelectCharacter(char)}
                >
                  <CardHeader>
                    <CardTitle>{char.name}</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <img src={char.img} alt={char.name} className="char-thumbnail" />
                    <p>{formatEra(char.era)}</p>
                  </CardBody>
                </Card>
              </Fade>
            ))}
          </div>

          {/* Character Preview */}
          {selectedChar && (
            <Slide direction="end" in={true}>
              <Fade in={true} key={selectedChar.name}>
                <div className="character-preview">
                  <h2>{selectedChar.name} ({formatEra(selectedChar.era)})</h2>
                  <img src={selectedChar.img} alt={selectedChar.name} className="char-full-image" />
                  <div className="character-facts">
                    <p>{selectedChar.fact}</p>
                  </div>
                  <Button
                    style={{ marginTop: "1rem", fontWeight: "bold" }}
                    onClick={() => navigate(`/play/${selectedChar.name.toLowerCase()}`)}
                  >
                    Select Character
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
