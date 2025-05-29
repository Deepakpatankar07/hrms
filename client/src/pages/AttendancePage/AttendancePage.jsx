import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header.jsx';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import Filter from '../../components/Filter/Filter.jsx';
import { MoreVertical, CheckCircle, XCircle } from 'react-feather';
import './AttendancePage.css';
import axios from 'axios';

const AttendancePage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Present', label: 'Present' },
    { value: 'Absent', label: 'Absent' },
  ];

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/attendance`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Fetched attendance:', response.data.data);
      setAttendance(response.data.data); 
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Error fetching attendance data');
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAttendance();
  }, []);

  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = record.employee.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleStatus = async (attendanceId, currentStatus) => {
    const newStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
    
    try {
      const response = await axios.put(`http://localhost:5000/api/v1/attendance/${attendanceId}`, {
        status: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setAttendance(attendance.map(record => 
        record._id === attendanceId ? response.data.data : record
      ));
    } catch (err) {
      setError(err.message || 'Error updating attendance status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="main-content">
      <Header title="Attendance Management" />
      
      <div className="attendance-filters">
        <SearchBar 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search by employee name"
        />
        
        <Filter
          label="Status"
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </div>
      
      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Position</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map(record => (
              <tr key={record._id}>
                <td>
                  <div className="employee-profile">
                    <div className="profile-avatar">
                      {record.employee.name.charAt(0)}
                    </div>
                  </div>
                </td>
                <td>{record.employee.name}</td>
                <td>{record.employee.position}</td>
                <td>
                  <span className={`status-badge ${record.status.toLowerCase()}`}>
                    {record.status === 'Present' ? (
                      <CheckCircle size={14} />
                    ) : (
                      <XCircle size={14} />
                    )}
                    {record.status}
                  </span>
                </td>
                <td>
                  <div className="dropdown">
                    <button className="dropdown-toggle">
                      <MoreVertical size={18} />
                    </button>
                    <div className="dropdown-menu-attendance">
                      <button onClick={() => toggleStatus(record._id, record.status)}>
                        Mark as {record.status === 'Present' ? 'Absent' : 'Present'}
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePage;