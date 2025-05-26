import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaUsers,
  FaCalendar,
  FaSignOutAlt,
  FaSearch,
} from "react-icons/fa";
import { IoCubeSharp } from "react-icons/io5";
import "./Sidebar.css";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>
          <IoCubeSharp /> HRMS
        </h2>
      </div>
      <nav className="sidebar-nav">
        <div className="header-search">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive || location.pathname === "/"
              ? "nav-link active"
              : "nav-link"
          }
        >
          <FaHome className="nav-icon" /> Dashboard
        </NavLink>
        <NavLink
          to="/candidates"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <FaUser className="nav-icon" /> Candidates
        </NavLink>
        <NavLink
          to="/employees"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <FaUsers className="nav-icon" /> Employees
        </NavLink>
        <NavLink
          to="/attendance"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <FaCalendar className="nav-icon" /> Attendance
        </NavLink>
        <NavLink
          to="/leaves"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <FaCalendar className="nav-icon" /> Leaves
        </NavLink>
        <NavLink to="/login" className="nav-link">
          <FaSignOutAlt className="nav-icon" /> Logout
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
