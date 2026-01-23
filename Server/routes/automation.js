const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const startAutomation = require("../automation/automation");

// ===== Automation Controller =====
let automationInstance = {
  running: false,
  stats: {
    totalFound: 0,
    totalApplied: 0,
    failed: 0,
  },
  browser: null,
};

// ===================== START AUTOMATION =====================
router.post("/start", authMiddleware, async (req, res) => {
  try {
    if (automationInstance.running) {
      return res.status(400).json({ msg: "Automation already running" });
    }

    automationInstance.running = true;
    automationInstance.stats = { totalFound: 0, totalApplied: 0, failed: 0 };

    // Fire-and-forget automation
    startAutomation(req.user.id)
      .then(() => {
        automationInstance.running = false;
        console.log("Automation completed for user:", req.user.id);
      })
      .catch((err) => {
        automationInstance.running = false;
        console.error("Automation error:", err.message);
      });

    res.json({ success: true, message: "Automation started" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to start automation" });
  }
});

// ===================== STOP AUTOMATION =====================
router.post("/stop", authMiddleware, async (req, res) => {
  try {
    if (automationInstance.browser) {
      await automationInstance.browser.close();
      automationInstance.running = false;
      res.json({ msg: "Automation stopped" });
    } else {
      res.status(400).json({ msg: "No automation is running" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to stop automation" });
  }
});

// ===================== GET STATS =====================
router.get("/stats", authMiddleware, (req, res) => {
  try {
    res.json({
      status: automationInstance.running,
      stats: automationInstance.stats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch automation stats" });
  }
});

module.exports = router;