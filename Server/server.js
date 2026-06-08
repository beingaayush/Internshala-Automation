const express = require("express");
const cors = require("cors");        //allows frontend to send data from diff origin
const app = express();
require("dotenv").config();
const connectDB = require("./config/db");
connectDB();
app.use(cors());
app.use(express.json());

//routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
const resumeRoutes = require("./routes/resume");
app.use("/api/resume", resumeRoutes);
const automationRoutes = require("./routes/automation");
app.use("/api/automation", automationRoutes);



const authMiddleware = require("./middleware/authMiddleware");
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ msg: "Access granted", userId: req.user });
});


app.get("/",(req,res)=>{
    res.send("Internshala Automation Backend Running");
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
