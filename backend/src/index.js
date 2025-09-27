import express from "express";
import dotenv from "dotenv";
import timelineRoutes from "./route/timeline.js";

// Load environment variables
dotenv.config();

const app = express();


// API Routes
app.use("/api/timeline", timelineRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔥 Using Firebase for database operations`);
});

export default app;
