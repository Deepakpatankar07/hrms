// import { useState } from 'react';
// import Header from '../../components/Header/Header.jsx';
// import SearchBar from '../../components/SearchBar/SearchBar.jsx';
// import Filter from '../../components/Filter/Filter.jsx';
// import Table from '../../components/Table/Table.jsx';
// import Button from '../../components/Button/Button.jsx';
// import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';
// import './LeavesPage.css';

// // Enhanced mock data
// const mockLeaves = [
//   { id: 1, employeeName: 'John Doe', startDate: '2025-05-25', endDate: '2025-05-27', reason: 'Family vacation', status: 'approved' },
//   { id: 2, employeeName: 'Jane Smith', startDate: '2025-05-26', endDate: '2025-05-26', reason: 'Doctor appointment', status: 'pending' },
//   { id: 3, employeeName: 'Robert Johnson', startDate: '2025-05-28', endDate: '2025-05-30', reason: 'Business trip', status: 'approved' },
//   { id: 4, employeeName: 'Emily Davis', startDate: '2025-06-01', endDate: '2025-06-05', reason: 'Personal leave', status: 'rejected' },
//   { id: 5, employeeName: 'Michael Brown', startDate: '2025-05-15', endDate: '2025-05-17', reason: 'Wedding', status: 'approved' },
// ];

// const LeavesPage = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [leaves, setLeaves] = useState(mockLeaves);

//   const statusOptions = [
//     { value: 'all', label: 'All Statuses' },
//     { value: 'pending', label: 'Pending' },
//     { value: 'approved', label: 'Approved' },
//     { value: 'rejected', label: 'Rejected' },
//   ];

//   // Filter leaves based on search term and status filter
//   const filteredLeaves = leaves.filter(leave => {
//     const matchesSearch = leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                          leave.reason.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const handleStatusChange = (id, newStatus) => {
//     setLeaves(leaves.map(leave => 
//       leave.id === id ? { ...leave, status: newStatus } : leave
//     ));
//   };

//   const renderActions = (leave) => (
//     <div className="leave-actions">
//       <select 
//         value={leave.status} 
//         onChange={(e) => handleStatusChange(leave.id, e.target.value)}
//         className={`status-select ${leave.status}`}
//       >
//         <option value="pending">Pending</option>
//         <option value="approved">Approved</option>
//         <option value="rejected">Rejected</option>
//       </select>
//     </div>
//   );

//   // Calendar generation
//   const start = startOfMonth(selectedDate);
//   const end = endOfMonth(selectedDate);
//   const days = eachDayOfInterval({ start, end });

//   const approvedLeaves = leaves.filter(leave => leave.status === 'approved');

//   const handlePrevMonth = () => {
//     setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
//   };

//   const handleNextMonth = () => {
//     setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
//   };

//   return (
//     <div className="main-content">
//       <Header />
//       <div className="leaves-header">
//         <div>
//           <h1>Leaves Management</h1>
//           <p>View and manage employee leave requests</p>
//         </div>
//         <Button variant="primary">+ Create Leave</Button>
//       </div>
      
//       <div className="filters-container">
//         <SearchBar 
//           value={searchTerm} 
//           onChange={(e) => setSearchTerm(e.target.value)}
//           placeholder="Search by name or reason..."
//         />
//         <Filter
//           label="Filter by Status"
//           options={statusOptions}
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//         />
//       </div>

//       <div className="calendar-section">
//         <div className="calendar-header">
//           <h2>{format(selectedDate, 'MMMM yyyy')}</h2>
//           <div className="calendar-nav">
//             <Button variant="text" onClick={handlePrevMonth}>&lt; Previous</Button>
//             <Button variant="text" onClick={() => setSelectedDate(new Date())}>Today</Button>
//             <Button variant="text" onClick={handleNextMonth}>Next &gt;</Button>
//           </div>
//         </div>
//         <div className="calendar-grid">
//           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//             <div key={day} className="calendar-day-header">{day}</div>
//           ))}
//           {days.map(day => {
//             const dayLeaves = approvedLeaves.filter(leave => {
//               const leaveStart = new Date(leave.startDate);
//               const leaveEnd = new Date(leave.endDate);
//               return isWithinInterval(day, { start: leaveStart, end: leaveEnd });
//             });
            
//             return (
//               <div 
//                 key={day} 
//                 className={`calendar-day ${dayLeaves.length > 0 ? 'has-leave' : ''}`}
//               >
//                 <div className="day-number">{format(day, 'd')}</div>
//                 {dayLeaves.map(leave => (
//                   <div key={leave.id} className="leave-event">
//                     {leave.employeeName}
//                   </div>
//                 ))}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <Table
//         columns={['Employee Name', 'Start Date', 'End Date', 'Reason', 'Status', 'Actions']}
//         data={filteredLeaves.map(leave => ({
//           ...leave,
//           startDate: format(new Date(leave.startDate), 'MMM dd, yyyy'),
//           endDate: format(new Date(leave.endDate), 'MMM dd, yyyy'),
//           status: (
//             <span className={`status-badge ${leave.status}`}>
//               {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
//             </span>
//           ),
//           actions: renderActions(leave)
//         }))}
//       />
//     </div>
//   );
// };

// export default LeavesPage;





import { useState } from 'react';
import Header from '../../components/Header/Header.jsx';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import Filter from '../../components/Filter/Filter.jsx';
import Button from '../../components/Button/Button.jsx';
import { MoreVertical, Edit, Trash2, Calendar } from 'react-feather';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';
import './LeavesPage.css';

const LeavesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [leaves, setLeaves] = useState([
    { 
      id: 1, 
      employeeName: 'Jane Copper', 
      startDate: '2025-05-25', 
      endDate: '2025-05-27', 
      reason: 'Family vacation', 
      status: 'approved' 
    },
    { 
      id: 2, 
      employeeName: 'Arlene McCoy', 
      startDate: '2025-05-26', 
      endDate: '2025-05-26', 
      reason: 'Doctor appointment', 
      status: 'pending' 
    },
    { 
      id: 3, 
      employeeName: 'Cody Fisher', 
      startDate: '2025-05-28', 
      endDate: '2025-05-30', 
      reason: 'Business trip', 
      status: 'approved' 
    },
    { 
      id: 4, 
      employeeName: 'Janney Wilson', 
      startDate: '2025-06-01', 
      endDate: '2025-06-05', 
      reason: 'Personal leave', 
      status: 'rejected' 
    },
  ]);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  // Filter leaves based on search term and status filter
  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         leave.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id, newStatus) => {
    setLeaves(leaves.map(leave => 
      leave.id === id ? { ...leave, status: newStatus } : leave
    ));
  };

  const handleDeleteLeave = (id) => {
    if (window.confirm('Are you sure you want to delete this leave record?')) {
      setLeaves(leaves.filter(leave => leave.id !== id));
    }
  };

  // Calendar generation
  const start = startOfMonth(selectedDate);
  const end = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start, end });

  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  return (
    <div className="main-content">
      <Header title="Leaves Management" />
      
      <div className="leaves-filters">
        <SearchBar 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or reason..."
        />
        <div className="filter-group">
          <Filter
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Button variant="primary">
            <Calendar size={16} style={{ marginRight: '8px' }} />
            Create Leave
          </Button>
        </div>
      </div>

      <div className="leaves-layout">
        <div className="leaves-table-container">
          <table className="leaves-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map(leave => (
                <tr key={leave.id}>
                  <td>
                    <div className="employee-profile">
                      <div className="profile-avatar">
                        {leave.employeeName.charAt(0)}
                      </div>
                      <span>{leave.employeeName}</span>
                    </div>
                  </td>
                  <td>{format(new Date(leave.startDate), 'MMM dd, yyyy')}</td>
                  <td>{format(new Date(leave.endDate), 'MMM dd, yyyy')}</td>
                  <td>{leave.reason}</td>
                  <td>
                    <span className={`status-badge ${leave.status}`}>
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="dropdown">
                      <button className="dropdown-toggle">
                        <MoreVertical size={18} />
                      </button>
                      <div className="dropdown-menu">
                        <select 
                          value={leave.status} 
                          onChange={(e) => handleStatusChange(leave.id, e.target.value)}
                          className={`status-select ${leave.status}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <button 
                          onClick={() => handleDeleteLeave(leave.id)} 
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

        <div className="leaves-calendar">
          <div className="calendar-header">
            <h4>{format(selectedDate, 'MMMM yyyy')}</h4>
            <div className="calendar-nav">
              <Button variant="text" onClick={handlePrevMonth}>&lt;</Button>
              <Button variant="text" onClick={() => setSelectedDate(new Date())}>Today</Button>
              <Button variant="text" onClick={handleNextMonth}>&gt;</Button>
            </div>
          </div>
          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
            {days.map(day => {
              const dayLeaves = leaves.filter(leave => {
                if (leave.status !== 'approved') return false;
                const leaveStart = new Date(leave.startDate);
                const leaveEnd = new Date(leave.endDate);
                return isWithinInterval(day, { start: leaveStart, end: leaveEnd });
              });
              
              return (
                <div 
                  key={day} 
                  className={`calendar-day ${dayLeaves.length > 0 ? 'has-leave' : ''}`}
                >
                  <div className="day-number">{format(day, 'd')}</div>
                  {dayLeaves.map(leave => (
                    <div key={leave.id} className="leave-event">
                      {leave.employeeName}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeavesPage;