const express = require("express");
const { ObjectId } = require("mongodb");
const { authenticateToken } = require("../middleware/auth");
const Password = require("../models/Password");

const router = express.Router();

// All password routes require authentication
router.use(authenticateToken);

const MAX_PASSWORDS = 10;

// Get all passwords for the authenticated user
router.get("/", async (req, res) => {
  try {
    const userId = req.user.userId;
    const passwordModel = new Password(req.db);
    const passwords = await passwordModel.getPasswordsByUserId(userId);

    // Convert MongoDB ObjectId to string for frontend
    const formattedPasswords = passwords.map((pwd) => ({
      id: pwd._id.toString(),
      site: pwd.site,
      username: pwd.username,
      password: pwd.password,
      createdAt: pwd.createdAt,
    }));

    res.json({ passwords: formattedPasswords });
  } catch (error) {
    console.error("Get passwords error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new password
router.post("/", async (req, res) => {
  try {
    const userId = req.user.userId;
    const { site, username, password } = req.body;

    if (!site || !username || !password) {
      return res
        .status(400)
        .json({ error: "Site, username, and password are required" });
    }

    if (site.length <= 3 || username.length <= 3 || password.length <= 3) {
      return res.status(400).json({
        error: "Site, username, and password must be more than 3 characters",
      });
    }

    const passwordModel = new Password(req.db);
    const count = await passwordModel.countPasswordsByUserId(userId);

    if (count >= MAX_PASSWORDS) {
      return res.status(400).json({
        error: `Maximum limit reached! You can only save ${MAX_PASSWORDS} passwords.`,
      });
    }

    const newPassword = await passwordModel.createPassword(
      userId,
      site,
      username,
      password
    );

    res.status(201).json({
      message: "Password saved successfully",
      password: {
        id: newPassword._id.toString(),
        site: newPassword.site,
        username: newPassword.username,
        password: newPassword.password,
        createdAt: newPassword.createdAt,
      },
    });
  } catch (error) {
    console.error("Create password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a password
router.put("/:id", async (req, res) => {
  try {
    const userId = req.user.userId;
    const passwordId = req.params.id;
    const { site, username, password } = req.body;

    if (!site || !username || !password) {
      return res
        .status(400)
        .json({ error: "Site, username, and password are required" });
    }

    if (site.length <= 3 || username.length <= 3 || password.length <= 3) {
      return res.status(400).json({
        error: "Site, username, and password must be more than 3 characters",
      });
    }

    const passwordModel = new Password(req.db);

    const result = await passwordModel.updatePassword(
      new ObjectId(passwordId),
      userId,
      site,
      username,
      password
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Password not found" });
    }

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    if (error.message.includes("ObjectId")) {
      return res.status(400).json({ error: "Invalid password ID" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a password
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user.userId;
    const passwordId = req.params.id;

    const passwordModel = new Password(req.db);

    const result = await passwordModel.deletePassword(
      new ObjectId(passwordId),
      userId
    );

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Password not found" });
    }

    res.json({ message: "Password deleted successfully" });
  } catch (error) {
    console.error("Delete password error:", error);
    if (error.message.includes("ObjectId")) {
      return res.status(400).json({ error: "Invalid password ID" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get password count
router.get("/count", async (req, res) => {
  try {
    const userId = req.user.userId;
    const passwordModel = new Password(req.db);
    const count = await passwordModel.countPasswordsByUserId(userId);

    res.json({ count: count, max: MAX_PASSWORDS });
  } catch (error) {
    console.error("Get count error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
