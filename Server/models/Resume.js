const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema(
  {
    //1 user = 1 resume is the rule
    user: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    // Basic Info
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true
    },
    city: String,
    state: String,

    // Profiles
    linkedin: String,
    github: String,
    portfolio: String,

    // Education
    education: [
      {
        degree: String,
        branch: String,
        college: String,
        startYear: Date,
        endYear: Date
      }
    ],

    // Skills
    skills: {
      programmingLanguages: [String],
      frontend: [String],
      backend: [String],
      databases: [String],
      tools: [String]
    },

    // Projects
    projects: [
      {
        title: String,
        description: String,
        technologies: [String],
        link: String
      }
    ],

    // Experience
    experience: [
      {
        role: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String
      }
    ],

    // Preferences
    internshipPreference: String,
    availability: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", ResumeSchema);
