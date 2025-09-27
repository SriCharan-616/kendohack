import express from "express";
import dotenv from "dotenv";
import get from "./controllers/getChoices.js";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// API Routes
app.use("/get-options", get);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔥 Using Firebase for database operations`);
});

export default app;
