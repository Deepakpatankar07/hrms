import './Filter.css';

const Filter = ({ label, options, value, onChange }) => {
  return (
    <div className="filter">
      <label>{label}</label>
      <select value={value} onChange={onChange}>
        <option value="">All</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;