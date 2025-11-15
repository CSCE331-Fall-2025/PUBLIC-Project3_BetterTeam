
import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test DB connection
pool.connect()
  .then(client => {
    console.log("Connected to PostgreSQL");
    client.release();
  })
  .catch(err => console.error("Connection error:", err));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server listening on port ${PORT}");
});




