const express = require("express");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "Pass_storage";

let client;
let db;

// Connect to MongoDB
async function connectDB() {
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(dbName);
    console.log("✅ Connected to MongoDB successfully");
    console.log(`📦 Database: ${dbName}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

// Middleware to attach db to request
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
const authRoutes = require("./routes/auth");
const passwordRoutes = require("./routes/passwords");

app.use("/api/auth", authRoutes);
app.use("/api/passwords", passwordRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Pass Storage API is running",
    version: "1.0.0",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
async function startServer() {
  await connectDB();
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📡 API endpoints:`);
    console.log(`   - POST /api/auth/register`);
    console.log(`   - POST /api/auth/login`);
    console.log(`   - GET  /api/auth/verify`);
    console.log(`   - GET  /api/passwords`);
    console.log(`   - POST /api/passwords`);
    console.log(`   - PUT  /api/passwords/:id`);
    console.log(`   - DELETE /api/passwords/:id`);
  });
}

startServer().catch(console.error);

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...");
  if (client) {
    await client.close();
    console.log("✅ MongoDB connection closed");
  }
  process.exit(0);
});
