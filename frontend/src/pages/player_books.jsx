import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Appbar from "../components/appbar";
import Book from "../components/Book/Book";
import { getAllPlayerBooks } from "../data/playerData";
import "../styles/player_books.css";

// Sounds
const clickSound = new Audio("/assets/click.mp3");
const pageFlipSound = new Audio("/assets/page-flip.mp3");

export default function PlayerBooksPage() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [flipType, setFlipType] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch player books on mount
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getAllPlayerBooks();
        setPlayers(data);
        if (data.length > 0) setSelectedPlayer(data[0]);
      } catch (err) {
        console.error("Failed to fetch player books:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const formatName = (name) => {
    if (typeof name !== "string") return "";
    return name
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .join("_");
  };

  const handlePlayerClick = (player) => {
    clickSound.currentTime = 0;
    clickSound.play();
    setSelectedPlayer(player);
    console.log("Selected player:", player);
  };

  const goHome = () => {
    pageFlipSound.currentTime = 0;
    pageFlipSound.play();
    setFlipType("home");
    setFlipped(true);

    // Navigate after flip animation
    setTimeout(() => navigate("/"), 1200);
  };

  return (
    <div className="character-page-container">
      <div className={`character-page-book ${flipped ? "flipped" : ""}`}>
        {/* FRONT FACE */}
        <div className="character-page-front">
          <Appbar title="Player Books" onHomeClick={goHome} />

          <div className="Top">
            {/* Sidebar: Player List */}
            <div className="character-list">
              {players.map((player) => (
                <div
                  key={player.playername} // Use playername as key
                  className={`hero-card ${
                    selectedPlayer?.playername === player.playername
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handlePlayerClick(player)}
                >
                  <img
                    src={`/assets/${formatName(player.name)}.png`} // Use 'name' for image path
                    alt={player.name}
                    className="char-thumbnail"
                  />
                  <div className="k-card-title">{player.playername}</div>
                </div>
              ))}
            </div>

            {/* Book Preview */}
            <div className="character-preview">
              {selectedPlayer ? (
                <>
                  <h2>{selectedPlayer.playername}'s Book</h2>
                  <Book
                    character={{ name: selectedPlayer.name }}
                    story={selectedPlayer.events.map((e) => ({
                      title: e.title,
                      event: e.event,
                    }))}
                  />
                </>
              ) : (
                <h2>No players available</h2>
              )}
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div className="character-page-back">
          {flipType === "home" && (
            <p >Going back home...</p>
          )}
        </div>
      </div>
    </div>
  );
}
