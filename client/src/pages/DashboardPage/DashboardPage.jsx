import Header from '../../components/Header/Header.jsx';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import Filter from '../../components/Filter/Filter.jsx';
import Table from '../../components/Table/Table.jsx';
import Button from '../../components/Button/Button.jsx';
import './DashboardPage.css';

const DashboardPage = () => {
  return (
    <div className="main-content">
      <Header title={"Dashboard"} />
      <div className="dashboard-container">
        <h4>Welcome to the HRMS Dashboard!</h4>
      </div>
    </div>
  );
};

export default DashboardPage;