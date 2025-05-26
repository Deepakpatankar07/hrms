import { useState } from "react";
import "./RegisterPage.css";
import Button from "../../components/Button/Button";
import { NavLink } from "react-router-dom";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for registration logic
    console.log("Register:", { fullName, email, password });
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h3>Create HRMS Account</h3>
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
            />
          </div>
          <div className="register-button-container">
            <Button type="submit" variant="purple">
              Register
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