import Header from "../../components/Header/Header.jsx";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import Filter from "../../components/Filter/Filter.jsx";
import Table from "../../components/Table/Table.jsx";
import Button from "../../components/Button/Button.jsx";
import "./DashboardPage.css";

const DashboardPage = () => {
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
