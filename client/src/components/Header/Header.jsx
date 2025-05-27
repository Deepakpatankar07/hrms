// src/components/Header/Header.js
import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";
import "./Header.css";
import { useAuth } from "../../context/AuthContext";

const Header = ({ title }) => {
  const { user } = useAuth();

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <header className="header">
      <div className="">
        <h3 className="header-title">{title}</h3>
      </div>
      <div className="header-actions">
        <FaBell className="header-icon" />
        <div className="header-profile">
          <div className="header-profile-avatar">
            {user ? getInitials(user.name) : <FaUserCircle />}
          </div>
        </div>
        <span className="header-user">{user?.name || "Loading..."}</span>
      </div>
    </header>
  );
};

export default Header;