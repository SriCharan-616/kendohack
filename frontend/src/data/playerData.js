// frontend/src/data/playerData.js

// Fetch all players
export const getAllPlayerBooks = async () => {
  const res = await fetch("http://localhost:5000/api/player-books");
  if (!res.ok) throw new Error("Failed to fetch player books");
  return await res.json(); // [{ name, events }]
};

// Fetch a single player's book
export const getPlayerBook = async (playerName) => {
  const res = await fetch(`http://localhost:5000/api/player-books/${playerName}`);
  if (!res.ok) throw new Error("Failed to fetch player book");
  return await res.json(); // { name, events }
};

// Save/update a player's book
export const savePlayerBook = async (playerName, events) => {
  const res = await fetch(`http://localhost:5000/api/player-books/${playerName}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(events),
  });
  if (!res.ok) throw new Error("Failed to save player book");
  return await res.json();
};
