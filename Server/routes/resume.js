const express = require("express");
const router = express.Router();
const Resume = require("../models/Resume");
const authMiddleware = require("../middleware/authMiddleware");

// Create / Update Resume {we're doing both operation using UPSERT}
router.post("/", authMiddleware, async (req, res) => {
  try {
    const data = { ...req.body, user: req.user.id };
    const resume = await Resume.findOneAndUpdate({ user: req.user.id }, data, { new: true, upsert: true });
    res.json(resume);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get Resume
router.get("/", authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user.id });
    if (!resume) return res.status(404).json({ msg: "Resume not found" });
    res.json(resume);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete Resume
router.delete("/", authMiddleware, async (req, res) => {
  try {
    const deletedResume = await Resume.findOneAndDelete({ user: req.user.id });
    if (!deletedResume) return res.status(404).json({ msg: "Resume not found" });
    res.json({ msg: "Resume deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;