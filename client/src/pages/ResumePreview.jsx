import "../styles/resumePreview.css";
import { useEffect, useState } from "react";
import API from "../services/api";

function ResumePreview() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await API.get("/resume");
        setResume(res.data);
      } catch (err) {
        console.log("Error fetching resume:", err.response?.data?.msg || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  if (loading) return <h2>Loading...</h2>;
  if (!resume) return <h2>No resume found</h2>;

  return (
    <div className="resume-header">
      {/* ===== Header ===== */}
      <h1 className="resume-name">{resume.fullName}</h1>
      <p className="resume-contact">{resume.email} | {resume.phone}</p>
      <p className="resume-location">{resume.city}, {resume.state}</p>

      <hr className="section-divider" />

      {/* ===== Education ===== */}
      <h3 className="section-title">Education</h3>
      {resume.education?.map((edu, index) => (
        <div key={index} className="education-item">
          <p className="education-degree"><b>{edu.degree}</b> - {edu.branch}</p>
          <p className="education-college">{edu.college}</p>
        </div>
      ))}

      <hr className="section-divider" />

      {/* ===== Skills ===== */}
      <h3 className="section-title">Skills</h3>
      <p className="skills-item">Languages: {resume.skills?.programmingLanguages?.join(", ")}</p>
      <p className="skills-item">Frontend: {resume.skills?.frontend?.join(", ")}</p>
      <p className="skills-item">Backend: {resume.skills?.backend?.join(", ")}</p>
      <p className="skills-item">Databases: {resume.skills?.databases?.join(", ")}</p>
      <p className="skills-item">Tools: {resume.skills?.tools?.join(", ")}</p>

      <hr className="section-divider" />

      {/* ===== Projects ===== */}
      <h3 className="section-title">Projects</h3>
      {resume.projects?.map((project, index) => (
        <div key={index} className="project-item">
          <p className="project-title"><b>{project.title}</b></p>
          <p className="project-desc">{project.description}</p>
          <p className="project-tech">Tech: {project.technologies?.join(", ")}</p>
          {project.link && <a href={project.link} className="project-link" target="_blank">Project Link</a>}
        </div>
      ))}
    </div>
  );
}

export default ResumePreview;

