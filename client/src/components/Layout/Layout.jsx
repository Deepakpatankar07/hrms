import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar.jsx';

const Layout = () => {
  return (
    <div className="container">
      <Sidebar />
      <Outlet /> {/* This will render nested routes */}
    </div>
  );
};

export default Layout;
