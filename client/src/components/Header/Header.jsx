import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';
import './Header.css';

const Header = ({title}) => {

  return (
    <header className="header">
      <div className="">
        <h3 className='header-title'>{title}</h3>
      </div>
      <div className="header-actions">
        <FaBell className="header-icon" />
        <FaUserCircle className="header-icon" />
        <span className="header-user">John Doe</span>
      </div>
    </header>
  );
};

export default Header;