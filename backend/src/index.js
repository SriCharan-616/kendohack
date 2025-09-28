import express from "express";
import dotenv from "dotenv";
import cors from "cors";   
import fs from "fs";
import path from "path";
import get from "./controllers/getChoices.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/get-options", get);

// Path to player_books storage
const STORAGE_PATH = path.join(
  process.cwd(),
  "storage",
  "player_books"
);

// Ensure folder exists
if (!fs.existsSync(STORAGE_PATH)) {
  fs.mkdirSync(STORAGE_PATH, { recursive: true });
}

// Helper to read JSON file and return events array
const readPlayerBook = (filePath) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return data.events || []; // ensure it's an array
};

// Fetch all player books
app.get("/api/player-books", (req, res) => {
  try {
    const files = fs.readdirSync(STORAGE_PATH).filter(f => f.endsWith(".json"));
    const players = files.map(file => {
      const name = path.basename(file, ".json");
      const events = readPlayerBook(path.join(STORAGE_PATH, file));
      return { name, events };
    });
    res.json(players);
  } catch (err) {
    console.error("Error reading all books:", err);
    res.status(500).json({ error: "Failed to read player books" });
  }
});

// Fetch single player's book
app.get("/api/player-books/:name", (req, res) => {
  try {
    const filePath = path.join(STORAGE_PATH, `${req.params.name}.json`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Book not found" });
    }
    const events = readPlayerBook(filePath);
    res.json({ name: req.params.name, events });
  } catch (err) {
    console.error("Error reading single book:", err);
    res.status(500).json({ error: "Failed to read player book" });
  }
});

// Save/update player book
app.post("/api/player-books/:name", (req, res) => {
  try {
    const filePath = path.join(STORAGE_PATH, `${req.params.name}.json`);
    // Always save as { events: [...] }
    const dataToSave = { events: req.body };
    fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2), "utf-8");
    res.json({ success: true, name: req.params.name });
  } catch (err) {
    console.error("Error saving book:", err);
    res.status(500).json({ error: "Failed to save player book" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("Storage path:", STORAGE_PATH);
console.log("Files found:", fs.readdirSync(STORAGE_PATH));

});

export default app;
