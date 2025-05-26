// import { NavLink } from "react-router-dom";
// import {
//   FaHome,
//   FaUser,
//   FaUsers,
//   FaCalendar,
//   FaSignOutAlt,
//   FaSearch,
// } from "react-icons/fa";
// import { IoCubeSharp } from "react-icons/io5";
// import { MdCoPresent } from "react-icons/md";
// import "./Sidebar.css";
// import { useLocation } from "react-router-dom";

// const Sidebar = () => {
//   const location = useLocation();
//   return (
//     <aside className="sidebar">
//       <div className="sidebar-logo">
//         <h2>
//           <IoCubeSharp /> HRMS
//         </h2>
//       </div>
//       <nav className="sidebar-nav">
//         <div className="header-search">
//           <FaSearch className="search-icon" />
//           <input type="text" placeholder="Search..." />
//         </div>
//         <NavLink
//           to="/dashboard"
//           className={({ isActive }) =>
//             isActive || location.pathname === "/"
//               ? "nav-link active"
//               : "nav-link"
//           }
//         >
//           <FaHome className="nav-icon" /> Dashboard
//         </NavLink>
//         <NavLink
//           to="/candidates"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           <FaUser className="nav-icon" /> Candidates
//         </NavLink>
//         <NavLink
//           to="/employees"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           <FaUsers className="nav-icon" /> Employees
//         </NavLink>
//         <NavLink
//           to="/attendance"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           <MdCoPresent className="nav-icon" /> Attendance
//         </NavLink>
//         <NavLink
//           to="/leaves"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           <FaCalendar className="nav-icon" /> Leaves
//         </NavLink>
//         <NavLink to="/login" className="nav-link">
//           <FaSignOutAlt className="nav-icon" /> Logout
//         </NavLink>
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;



import { useState } from "react";
import { NavLink } from "react-router-dom";
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

const Sidebar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
          <NavLink 
            to="/login" 
            className="nav-link"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaSignOutAlt className="nav-icon" /> Logout
          </NavLink>
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
