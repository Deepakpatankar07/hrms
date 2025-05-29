import "./DashboardPage.css";
import { useAuth } from "../../context/AuthContext";

const DashboardPage = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-main-container">
      <div className="dashboard-container">
        <div className="dashboard-welcome-image">
          <img className="" src="../../src/assets/welcome.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;