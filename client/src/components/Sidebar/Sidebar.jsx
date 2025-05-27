import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaUsers,
  FaCalendar,
  FaSignOutAlt,
  FaSearch,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { IoCubeSharp } from "react-icons/io5";
import { MdCoPresent } from "react-icons/md";
import { useLocation } from "react-router-dom";
import "./Sidebar.css";
import { useAuth } from "../../context/AuthContext.jsx";

const Sidebar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="mobile-logo">
          <IoCubeSharp /> HRMS
        </div>
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar/Navigation */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <h2>
            <IoCubeSharp /> HRMS
          </h2>
        </div>
        <nav className="sidebar-nav">
          <div className="header-search">
            <FaSearch className="sidebar-search-icon" />
            <input type="text" placeholder="Search..." />
          </div>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive || location.pathname === "/"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaHome className="nav-icon" /> Dashboard
          </NavLink>
          <NavLink
            to="/candidates"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaUser className="nav-icon" /> Candidates
          </NavLink>
          <NavLink
            to="/employees"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaUsers className="nav-icon" /> Employees
          </NavLink>
          <NavLink
            to="/attendance"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <MdCoPresent className="nav-icon" /> Attendance
          </NavLink>
          <NavLink
            to="/leaves"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaCalendar className="nav-icon" /> Leaves
          </NavLink>
          <div
            className="nav-link"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="nav-icon" /> Logout
          </div>
        </nav>
      </aside>
      
      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={toggleMobileMenu}></div>
      )}
    </>
  );
};

export default Sidebar;
