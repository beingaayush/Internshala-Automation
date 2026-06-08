import "../styles/dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { hover } from "@testing-library/user-event/dist/hover";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Resume and Automation states
  const [resumeExists, setResumeExists] = useState(false);
  const [automationOn, setAutomationOn] = useState(false);
  const [currentAction, setCurrentAction] = useState("");
  const [automationStats, setAutomationStats] = useState({
    totalFound: 0,
    totalApplied: 0,
    failed: 0,
  });

  // ================= AUTH + USER FETCH =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);

        // Check if resume exists
        try {
          await API.get("/resume");
          setResumeExists(true);
        } catch {
          setResumeExists(false);
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  // ================= AUTOMATION STATS POLLING =================
  useEffect(() => {
    let interval;

    if (automationOn) {
      interval = setInterval(async () => {
        try {
          const res = await API.get("/automation/stats");
          setAutomationStats(res.data.stats);

          // Update current action dynamically
          if (res.data.status) {
            if (res.data.stats.totalApplied < res.data.stats.totalFound) {
              setCurrentAction("Applying internships...");
            } else if (res.data.stats.totalApplied === res.data.stats.totalFound) {
              setCurrentAction("Automation completed");
            } else {
              setCurrentAction("Searching internships...");
            }
          } else {
            setCurrentAction("Automation stopped");
          }
        } catch (err) {
          console.error(err);
        }
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [automationOn]);

  // ================= START AUTOMATION =================
  const startAutomation = async () => {
    try {
      // Disable button if already running
      if (automationOn) return;

      const email = prompt("Enter Internshala Email");
      const password = prompt("Enter Internshala Password");

      // If cookies exist, prompt optional
      // Can leave blank for existing users
      if (!email || !password) {
        alert("Email/Password required for first time login");
        return;
      }

      await API.post("/automation/start", { email, password });

      setAutomationOn(true);
      setCurrentAction("Searching internships...");
      setAutomationStats({ totalFound: 0, totalApplied: 0, failed: 0 });
    } catch (err) {
      console.error(err);
      alert("Failed to start automation");
    }
  };

  // ================= STOP AUTOMATION =================
  const stopAutomation = async () => {
    try {
      await API.post("/automation/stop");
      setAutomationOn(false);
      setCurrentAction("Automation stopped");
    } catch (err) {
      console.error(err);
      alert("Failed to stop automation");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <h2>Loading...</h2>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-text">Welcome, {user.name}</p>

      <hr />

      {/* Resume Status */}
      <div className="dashboard-card">
      <h3 className="dashboard-section-title">Resume Status</h3>
      <p className="dashboard-status">{resumeExists ? "Resume created" : "Not created"}</p>
      </div>

      <hr />

      {/* Automation Section */}
      <div className="dashboard-card">
      <h3 className="dashboard-section-title">Automation</h3>
      <p className="dashboard-status">Status: <span className="dashboard-highlight">{automationOn ? "ON" : "OFF"}</span></p>
      <button
        className="dashboard-btn-start"
        onClick={startAutomation}
        disabled={automationOn}
        style={{ marginRight: "10px" }}
      >
        Start Automation
      </button>
      <button className="dashboard-btn-stop" onClick={stopAutomation} disabled={!automationOn}>
        Stop Automation
      </button>
      <p className="dashboard-text">Current Action: {currentAction}</p>
      </div>

      <hr />

      {/* Automation Stats */}
      <div className="dashboard-card">
      <h3 className="dashboard-section-title">Automation Stats</h3>
      <p className="dashboard-text">Total internships found: {automationStats.totalFound}</p>
      <p className="dashboard-text">Total applied: {automationStats.totalApplied}</p>
      <p className="dashboard-text">Failed / skipped: {automationStats.failed}</p>
      </div>

      <hr />

      {/* Navigation */}
      <div className="dashboard-card">
        <button className="dashboard-btn-nav" onClick={() => navigate("/resume")}>Edit Resume</button>
        <button className="dashboard-btn-nav" onClick={() => navigate("/preview")}>Resume Preview</button>
        <button className="dashboard-btn-nav logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;