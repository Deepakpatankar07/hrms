import { useState } from 'react';
import Header from '../../components/Header/Header.jsx';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import Filter from '../../components/Filter/Filter.jsx';
import Button from '../../components/Button/Button.jsx';
import { MoreVertical, Edit, Trash2 } from 'react-feather';
import './EmployeesPage.css';

const EmployeesPage = () => {
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [employees, setEmployees] = useState([
    { 
      id: '1',
      name: 'Jane Copper', 
      email: 'jane.copper@example.com', 
      phone: '(704) 555-0127',
      position: 'Intern',
      department: 'Designer',
      joiningDate: '10/15/23'
    },
    { 
      id: '2',
      name: 'Arlene McCoy', 
      email: 'arlene.mccoy@example.com', 
      phone: '(302) 555-0107',
      position: 'Full Time',
      department: 'Designer',
      joiningDate: '11/20/22'
    },
    { 
      id: '3',
      name: 'Cody Fisher', 
      email: 'deanna.curtis@example.com', 
      phone: '(252) 555-0126',
      position: 'Senior',
      department: 'Backend Development',
      joiningDate: '08/15/17'
    },
    { 
      id: '4',
      name: 'Janney Wilson', 
      email: 'janney.wilson@example.com', 
      phone: '(252) 555-0126',
      position: 'Junior',
      department: 'Backend Development',
      joiningDate: '12/04/17'
    },
    { 
      id: '5',
      name: 'Leslie Alexander', 
      email: 'willie.jennings@example.com', 
      phone: '(207) 555-0119',
      position: 'Team Lead',
      department: 'Human Resource',
      joiningDate: '05/30/14'
    },
  ]);

  const positionOptions = [
    { value: '', label: 'All Positions' },
    { value: 'Intern', label: 'Intern' },
    { value: 'Full Time', label: 'Full Time' },
    { value: 'Junior', label: 'Junior' },
    { value: 'Senior', label: 'Senior' },
    { value: 'Team Lead', label: 'Team Lead' },
  ];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(search.toLowerCase()) || 
                         employee.email.toLowerCase().includes(search.toLowerCase());
    const matchesPosition = !positionFilter || employee.position === positionFilter;
    return matchesSearch && matchesPosition;
  });

  const handleEditEmployee = (employeeId) => {
    // In a real app, this would open an edit modal/form
    const employee = employees.find(e => e.id === employeeId);
    alert(`Editing employee: ${employee.name}`);
  };

  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(employee => employee.id !== employeeId));
    }
  };

  return (
    <div className="main-content">
      <Header title="Employee Management" />
      
      <div className="employees-filters">
        <SearchBar 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search by name or email"
        />
        
        <Filter
          label="Position"
          options={positionOptions}
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
        />
      </div>
      
      <div className="employees-table-container">
        <table className="employees-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Department</th>
              <th>Date of Joining</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(employee => (
              <tr key={employee.id}>
                <td>
                  <div className="employee-profile">
                    <div className="profile-avatar">
                      {employee.name.charAt(0)}
                    </div>
                  </div>
                </td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{employee.position}</td>
                <td>{employee.department}</td>
                <td>{employee.joiningDate}</td>
                <td>
                  <div className="dropdown">
                    <button className="dropdown-toggle">
                      <MoreVertical size={18} />
                    </button>
                    <div className="dropdown-menu">
                      <button onClick={() => handleEditEmployee(employee.id)}>
                        <Edit size={14} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteEmployee(employee.id)} 
                        className="delete"
                      >
                        <Trash2 size={14} /> Delete
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

export default EmployeesPage;