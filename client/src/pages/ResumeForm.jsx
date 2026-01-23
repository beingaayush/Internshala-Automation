import "../styles/resumeForm.css";
import { useEffect, useState } from "react";
import API from "../services/api";

function ResumeForm() {
  // =================== States ===================
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    linkedin: "",
    github: "",
    portfolio: "",
    internshipPreference: "",
    availability: "",
    education: [],
    skills: {
      programmingLanguages: "",
      frontend: "",
      backend: "",
      databases: "",
      tools: ""
    },
    projects: [],
    experience: []
  });

  // =================== Helper Functions ===================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // =================== Education Functions ===================
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { degree: "", branch: "", college: "", startYear: "", endYear: "" }]
    });
  };

  const removeEducation = (index) => {
    const newEdu = [...formData.education];
    newEdu.splice(index, 1);
    setFormData({ ...formData, education: newEdu });
  };

  const handleEducationChange = (e, index, field) => {
    const newEdu = [...formData.education];
    newEdu[index][field] = e.target.value;
    setFormData({ ...formData, education: newEdu });
  };

  // =================== Projects Functions ===================
  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { title: "", description: "", techStack: "", link: "" }]
    });
  };

  const removeProject = (index) => {
    const newProjects = [...formData.projects];
    newProjects.splice(index, 1);
    setFormData({ ...formData, projects: newProjects });
  };

  const handleProjectChange = (e, index, field) => {
    const newProjects = [...formData.projects];
    newProjects[index][field] = e.target.value;
    setFormData({ ...formData, projects: newProjects });
  };

  // =================== Experience Functions ===================
  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        { role: "", company: "", startDate: "", endDate: "", description: "" }
      ]
    });
  };

  // Remove experience
  const removeExperience = (index) => {
    const newExp = [...formData.experience];
    newExp.splice(index, 1);
    setFormData({ ...formData, experience: newExp });
  };

  // Handle experience change
  const handleExperienceChange = (e, index, field) => {
    const newExp = [...formData.experience];
    newExp[index][field] = e.target.value;
    setFormData({ ...formData, experience: newExp });
  };

  // =================== Fetch Resume ===================
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await API.get("/resume");
        setResume(res.data);

        setFormData({
          fullName: res.data.fullName || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          city: res.data.city || "",
          state: res.data.state || "",
          linkedin: res.data.linkedin || "",
          github: res.data.github || "",
          portfolio: res.data.portfolio || "",
          internshipPreference: res.data.internshipPreference || "",
          availability: res.data.availability || "",
          education: res.data.education || [],
          skills: res.data.skills || {
            programmingLanguages: "",
            frontend: "",
            backend: "",
            databases: "",
            tools: ""
          },
          projects: res.data.projects || [],
          experience: res.data.experience || []
        });
      } catch (err) {
        console.log("No resume found or error:", err.response?.data?.msg || err.message);
        setResume(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  // =================== Submit ===================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/resume", formData);
      setResume(res.data);
      alert("Resume saved successfully!");
    } catch (err) {
      console.error("Error saving resume:", err.response?.data?.msg || err.message);
      alert("Error saving resume");
    }
  };

  // =================== Delete ===================
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your resume?")) return;

    try {
      await API.delete("/resume");
      setResume(null);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        city: "",
        state: "",
        linkedin: "",
        github: "",
        portfolio: "",
        internshipPreference: "",
        availability: "",
        education: [],
        skills: {
          programmingLanguages: "",
          frontend: "",
          backend: "",
          databases: "",
          tools: ""
        },
        projects: [],
        experience: []
      });
      alert("Resume deleted successfully!");
    } catch (err) {
      console.error("Error deleting resume:", err.response?.data?.msg || err.message);
      alert("Error deleting resume");
    }
  };

  // =================== Loading ===================
  if (loading) return <h2>Loading...</h2>;

  // =================== JSX Form ===================
  return (
    <div className="resume-container">
      <h1 className="resume-title">Resume Form</h1>
      <form className="resume-form" onSubmit={handleSubmit}>
        {/* Basic Info */}
        <input className="resume-input" type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
        <input className="resume-input" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input className="resume-input" type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        <input className="resume-input" type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
        <input className="resume-input" type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} />
        <input className="resume-input" type="text" name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleChange} />
        <input className="resume-input" type="text" name="github" placeholder="GitHub URL" value={formData.github} onChange={handleChange} />
        <input className="resume-input" type="text" name="portfolio" placeholder="Portfolio URL" value={formData.portfolio} onChange={handleChange} />
        <input className="resume-input" type="text" name="internshipPreference" placeholder="Internship Preference" value={formData.internshipPreference} onChange={handleChange} />

        {/* Education */}
        <h3 className="resume-section-title">Education</h3>
        {formData.education.map((edu, index) => (
          <div className="resume-section-entry" key={index} >
            <input className="resume-input" type="text" placeholder="Degree" value={edu.degree} onChange={(e) => handleEducationChange(e, index, "degree")} required />
            <input className="resume-input" type="text" placeholder="Branch" value={edu.branch} onChange={(e) => handleEducationChange(e, index, "branch")} />
            <input className="resume-input" type="text" placeholder="College" value={edu.college} onChange={(e) => handleEducationChange(e, index, "college")} />
            <input className="resume-input" type="date" placeholder="Start Year" value={edu.startYear ? edu.startYear.split("T")[0] : ""} onChange={(e) => handleEducationChange(e, index, "startYear")} />
            <input className="resume-input" type="date" placeholder="End Year" value={edu.endYear ? edu.endYear.split("T")[0] : ""} onChange={(e) => handleEducationChange(e, index, "endYear")} />
            <button className="resume-remove-button" type="button" onClick={() => removeEducation(index)}>Remove</button>
          </div>
        ))}
        <button className="resume-add-button" type="button" onClick={addEducation}>Add Education</button>

        {/* Projects */}
        <h3 className="resume-section-title">Projects</h3>
        {formData.projects.map((project, index) => (
          <div className="resume-section-entry" key={index} >
            <input className="resume-input" type="text" placeholder="Project Title" value={project.title} onChange={(e) => handleProjectChange(e, index, "title")} />
            <input className="resume-input" type="text" placeholder="Tech Stack (React, Node, MongoDB)" value={project.techStack} onChange={(e) => handleProjectChange(e, index, "techStack")} />
            <input className="resume-input" type="text" placeholder="Project Link" value={project.link} onChange={(e) => handleProjectChange(e, index, "link")} />
            <textarea className="resume-input" placeholder="Project Description" value={project.description} onChange={(e) => handleProjectChange(e, index, "description")} />
            <button className="resume-remove-button" type="button" onClick={() => removeProject(index)}>Remove</button>
          </div>
        ))}
        <button className="resume-add-button" type="button" onClick={addProject}>Add Project</button>

        {/* experience */}
        <h3 className="resume-section-title">Experience</h3>
        {formData.experience.map((exp, index) => (
          <div className="resume-section-entry" key={index} >
            <input
              className="resume-input"
              type="text"
              placeholder="Role / Position"
              value={exp.role}
              onChange={(e) => handleExperienceChange(e, index, "role")}
            />
            <input
              className="resume-input"
              type="text"
              placeholder="Company"
              value={exp.company}
              onChange={(e) => handleExperienceChange(e, index, "company")}
            />
            <input
              className="resume-input"
              type="date"
              placeholder="Start Date"
              value={exp.startDate ? exp.startDate.split("T")[0] : ""}
              onChange={(e) => handleExperienceChange(e, index, "startDate")}
            />
            <input
              className="resume-input"
              type="date"
              placeholder="End Date"
              value={exp.endDate ? exp.endDate.split("T")[0] : ""}
              onChange={(e) => handleExperienceChange(e, index, "endDate")}
            />
            <textarea
              className="resume-input"
              placeholder="Description"
              value={exp.description}
              onChange={(e) => handleExperienceChange(e, index, "description")}
            />
            <button className="resume-remove-button" type="button" onClick={() => removeExperience(index)}>Remove</button>
          </div>
        ))}
        <button className="resume-add-button" type="button" onClick={addExperience}>Add Experience</button>


        {/* Skills */}
        <h3 className="resume-section-title">Skills</h3>
        {["programmingLanguages", "frontend", "backend", "databases", "tools"].map((skill) => (
          <input
            className="resume-input"
            key={skill}
            type="text"
            placeholder={skill.charAt(0).toUpperCase() + skill.slice(1)}
            value={formData.skills?.[skill] || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                skills: { ...formData.skills, [skill]: e.target.value }
              })
            }
          />
        ))}

        <input className="resume-input" type="text" name="availability" placeholder="Availability" value={formData.availability} onChange={handleChange} />

        <button className="resume-submit-button" type="submit">Save / Update Resume</button>
      </form>

      {resume && (
        <button className="resume-delete-button" onClick={handleDelete}>Delete Resume</button>
      )}
    </div>
  );
}

export default ResumeForm;
