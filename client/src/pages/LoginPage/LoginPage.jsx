import { useState } from "react";
import axios from "axios";
import "./LoginPage.css";
import Button from "../../components/Button/Button";
import { NavLink, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      
      // Make API call to login endpoint
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login", 
        {
          email,
          password
        }
      );

      // Handle successful login
      const { token } = response.data;
      
      // Store the token in localStorage or context/state management
      localStorage.setItem("token", token);
      
      // Redirect to dashboard or home page
      navigate("/"); 
      
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h3>Login to HRMS</h3>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
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
            />
          </div>
          <div className="form-group">
            <NavLink to="/forgot-password" className="forget-password">
              Forget Password?
            </NavLink>
          </div>
          <div className="login-button-container">
            <Button type="submit" variant="purple" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>
          <div className="form-group">
            <NavLink to="/register" className="register-link">
              <h4>Don't have an account? <span>Register</span></h4>
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;