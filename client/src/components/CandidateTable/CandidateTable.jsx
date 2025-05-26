import { useState } from 'react';
import { FaEllipsisV, FaDownload, FaTrash } from 'react-icons/fa';
import Table from '../Table/Table';
import './CandidateTable.css';

const CandidateTable = ({ data, onStatusChange, onDelete }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const columns = ['Name', 'Email', 'Phone Number', 'Position', 'Status', 'Experience'];

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleStatusChange = (candidate, newStatus) => {
    onStatusChange(candidate, newStatus);
  };

  const renderRow = (candidate, index) => ({
    name: candidate.name,
    email: candidate.email,
    phone: candidate.phone,
    position: candidate.position,
    status: (
      <select
        value={candidate.status}
        onChange={(e) => handleStatusChange(candidate, e.target.value)}
      >
        <option value="pending">Pending</option>
        <option value="selected">Selected</option>
        <option value="rejected">Rejected</option>
      </select>
    ),
    experience: candidate.experience,
  });

  const renderActions = (candidate, index) => (
    <div className="action-wrapper">
      <FaEllipsisV
        className="action-icon"
        onClick={() => toggleDropdown(index)}
      />
      {activeDropdown === index && (
        <div className="action-dropdown">
          <a href={candidate.resumeUrl} download className="dropdown-item">
            <FaDownload /> Download Resume
          </a>
          <button
            className="dropdown-item dropdown-item-danger"
            onClick={() => {
              onDelete(candidate.id);
              setActiveDropdown(null);
            }}
          >
            <FaTrash /> Delete Candidate
          </button>
        </div>
      )}
    </div>
  );

  return (
    <Table
      columns={columns}
      data={data.map((candidate, index) => renderRow(candidate, index))}
      renderActions={(candidate, index) => renderActions(candidate, index)}
    />
  );
};

export default CandidateTable;