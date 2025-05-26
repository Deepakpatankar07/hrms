import { useState } from 'react';
import Header from '../../components/Header/Header.jsx';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import Filter from '../../components/Filter/Filter.jsx';
import { MoreVertical, CheckCircle, XCircle } from 'react-feather';
import './AttendancePage.css';

const AttendancePage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [attendance, setAttendance] = useState([
    { 
      id: '1',
      name: 'Jane Copper', 
      position: 'Full Time', 
      department: 'Designer',
      tasks: 'Dashboard Home page Alignment',
      status: 'Present'
    },
    { 
      id: '2',
      name: 'Arlene McCoy', 
      position: 'Full Time', 
      department: 'Designer',
      tasks: 'Dashboard Login page design, Dashboard Home page design',
      status: 'Present'
    },
    { 
      id: '3',
      name: 'Cody Fisher', 
      position: 'Senior', 
      department: 'Backend Development',
      tasks: '--',
      status: 'Absent'
    },
    { 
      id: '4',
      name: 'Janney Wilson', 
      position: 'Junior', 
      department: 'Backend Development',
      tasks: 'Dashboard login page integration',
      status: 'Present'
    },
    { 
      id: '5',
      name: 'Leslie Alexander', 
      position: 'Team Lead', 
      department: 'Human Resource',
      tasks: '4 scheduled interview, Sorting of resumes',
      status: 'Present'
    },
  ]);

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Present', label: 'Present' },
    { value: 'Absent', label: 'Absent' },
  ];

  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleStatus = (employeeId) => {
    setAttendance(attendance.map(employee => {
      if (employee.id === employeeId) {
        return {
          ...employee,
          status: employee.status === 'Present' ? 'Absent' : 'Present'
        };
      }
      return employee;
    }));
  };

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
              <th>Department</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map(employee => (
              <tr key={employee.id}>
                <td>
                  <div className="employee-profile">
                    <div className="profile-avatar">
                      {employee.name.charAt(0)}
                    </div>
                  </div>
                </td>
                <td>{employee.name}</td>
                <td>{employee.position}</td>
                <td>{employee.department}</td>
                <td>
                  <span className={`status-badge ${employee.status.toLowerCase()}`}>
                    {employee.status === 'Present' ? (
                      <CheckCircle size={14} />
                    ) : (
                      <XCircle size={14} />
                    )}
                    {employee.status}
                  </span>
                </td>
                <td>
                  <div className="dropdown">
                    <button className="dropdown-toggle">
                      <MoreVertical size={18} />
                    </button>
                    <div className="dropdown-menu-attendance">
                      <button onClick={() => toggleStatus(employee.id)}>
                        Mark as {employee.status === 'Present' ? 'Absent' : 'Present'}
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