import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="search-bar">
      <FaSearch className="search-bar-icon" />
      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBar;