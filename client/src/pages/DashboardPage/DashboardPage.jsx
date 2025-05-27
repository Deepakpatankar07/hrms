// src/pages/DashboardPage/DashboardPage.js
import "./DashboardPage.css";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header/Header";

const DashboardPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-main-container">
      {/* <Header title="Dashboard" /> */}
      <div className="dashboard-container">
        {/* {user && <p>Welcome back, {user.name}!</p>} */}
        <div className="dashboard-welcome-image">
          <img className="" src="../../src/assets/welcome.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;