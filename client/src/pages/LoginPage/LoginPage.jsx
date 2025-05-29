import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./LoginPage.css";
import Button from "../../components/Button/Button";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("Please fill in all fields");
    }

    try {
      setLoading(true);
      const result = await login(email, password);
      
      if (!result.success) {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
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
              minLength="8"
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