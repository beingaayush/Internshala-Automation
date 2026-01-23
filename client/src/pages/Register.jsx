import "../styles/register.css";
import { useState } from "react";
import API from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // 1. Register
    await API.post("/auth/signup", formData);

    // 2. Login immediately
    const loginRes = await API.post("/auth/login", {
      email: formData.email,
      password: formData.password,
    });
    // Isse frontend ko pata chal jayega ki user new hai ya already registered.
    localStorage.setItem("registered", "true");
    
    // 3. Store new token
    localStorage.setItem("token", loginRes.data.token);

    // 4. Redirect to dashboard
    window.location.href = "/dashboard";
  } catch (err) {
    alert(err.response?.data?.msg || "Error");
  }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2 className="register-title">Register</h2>

      <input
        className="register-input"
        name="name"
        placeholder="Name"
        onChange={handleChange}
        required
      />

      <input
        className="register-input"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />

      <input
        className="register-input"
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />

      <button className="register-button" type="submit">Register</button>
    </form>
  );
}

export default Register;