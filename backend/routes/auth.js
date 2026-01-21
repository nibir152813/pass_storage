const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, authenticateToken } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

const toPublicUser = (user) => ({
  email: user.email,
  id: user._id.toString(),
  isPremium: Boolean(user.isPremium),
});


router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const userModel = new User(req.db);
    const existingUser = await userModel.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.createUser(email, hashedPassword);

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User created successfully",
      token: token,
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userModel = new User(req.db);
    const user = await userModel.findByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token: token,
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/verify", authenticateToken, async (req, res) => {
  try {
    const userModel = new User(req.db);
    const user = await userModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user: toPublicUser(user) });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/verify-password", authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.userId;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const userModel = new User(req.db);
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    res.json({ message: "Password verified successfully", verified: true });
  } catch (error) {
    console.error("Verify password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//  payment upgrade: unlock unlimited passwords
router.post("/upgrade", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userModel = new User(req.db);
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isPremium) {
      return res.json({ message: "Already premium", user: toPublicUser(user) });
    }

    const upgraded = await userModel.upgradeToPremium(userId);
    res.json({ message: "Payment successful. Premium unlocked.", user: toPublicUser(upgraded) });
  } catch (error) {
    console.error("Upgrade error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
