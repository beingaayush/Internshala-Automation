import "../styles/login.css";
import { useState } from "react";
import API from "../services/api";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  // const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard"; // redirect after login
    } catch (err) {
      alert(err.response?.data?.msg || "Login error");
    }
  };


  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2 className="login-title">Login</h2>

      <input
        className="login-input"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />

      <input
        className="login-input"
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />

      <button className="login-button" type="submit">Login</button>
    </form>
  );
}

export default Login;