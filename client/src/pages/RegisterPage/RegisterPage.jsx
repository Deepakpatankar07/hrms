import { useState } from "react";
import axios from "axios";
import "./RegisterPage.css";
import Button from "../../components/Button/Button";
import { NavLink, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      
      const response = await axios.post("http://localhost:5000/api/v1/auth/register", {
        name: fullName,
        email,
        password,
      });

      console.log("Registration successful:", response.data);
      navigate("/login");
      
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h3>Create HRMS Account</h3>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength="8"
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              minLength="8"
            />
          </div>
          <div className="register-button-container">
            <Button type="submit" variant="purple" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </div>
          <div className="form-group">
            <NavLink to="/login" className="login-link">
              Already have an account? <span>Login</span>
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;