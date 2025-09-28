import express from "express";
import dotenv from "dotenv";
import cors from "cors";                // ✅ Import cors
import get from "./controllers/getChoices.js";

// Load environment variables
dotenv.config();

const app = express();

// ✅ Use CORS before defining routes
// Allow all origins (development):
app.use(cors());

// Or allow only specific origins (production example):
// app.use(cors({ origin: "http://localhost:3000" }));

// Middleware
app.use(express.json());

// API Routes
app.use("/get-options", get);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
