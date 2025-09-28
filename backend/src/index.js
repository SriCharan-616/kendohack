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
const STORAGE_PATH = path.join(process.cwd(), "storage", "player_books");

// Ensure folder exists
if (!fs.existsSync(STORAGE_PATH)) {
  fs.mkdirSync(STORAGE_PATH, { recursive: true });
}

// Helper to read JSON file and return the whole data
const readPlayerBook = (filePath) => {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return data;
};

// Fetch all player books
app.get("/api/player-books", (req, res) => {
  try {
    const files = fs.readdirSync(STORAGE_PATH).filter(f => f.endsWith(".json"));
    const players = files.map(file => {
      const filePath = path.join(STORAGE_PATH, file);
      const data = readPlayerBook(filePath);
      return {
        playername: path.parse(file).name, // filename without .json
        name: data.name,
        events: data.events || []
      };
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
    const files = fs.readdirSync(STORAGE_PATH).filter(f => f.endsWith(".json"));
    const file = files.find(f => {
      const data = readPlayerBook(path.join(STORAGE_PATH, f));
      return data.name.toLowerCase() === req.params.name.toLowerCase();
    });

    if (!file) {
      return res.status(404).json({ error: "Book not found" });
    }

    const data = readPlayerBook(path.join(STORAGE_PATH, file));
    res.json({
      playername: path.parse(file).name, // filename without .json
      name: data.name,
      events: data.events || []
    });
  } catch (err) {
    console.error("Error reading single book:", err);
    res.status(500).json({ error: "Failed to read player book" });
  }
});

// Save/update player book
app.post("/api/player-book/:name", (req, res) => {
  try {
    const files = fs.readdirSync(STORAGE_PATH).filter(f => f.endsWith(".json"));
    let file = files.find(f => {
      const data = readPlayerBook(path.join(STORAGE_PATH, f));
      return data.name.toLowerCase() === req.params.name.toLowerCase();
    });

    // If file doesn't exist, create new JSON with sanitized filename
    if (!file) {
      const sanitizedName = req.params.name.toLowerCase().replace(/\s+/g, "_");
      file = `${sanitizedName}.json`;
    }

    const filePath = path.join(STORAGE_PATH, file);
    const dataToSave = { name: req.params.name, events: req.body };
    fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2), "utf-8");

    res.json({
      success: true,
      playername: path.parse(file).name, // filename without .json
      name: req.params.name
    });
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
