import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header.jsx';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import Filter from '../../components/Filter/Filter.jsx';
import Button from '../../components/Button/Button.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import LeaveForm from '../../components/LeaveForm/LeaveForm.jsx';
import { MoreVertical, Edit, Trash2, Calendar, Download } from 'react-feather';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';
import './LeavesPage.css';
import { useAuth } from '../../context/AuthContext';

const LeavesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/v1/leaves', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setLeaves(response.data.data);
      } catch (err) {
        console.error('Failed to fetch leaves', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = leave.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         leave.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || leave.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/v1/leaves/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setLeaves(leaves.map(leave => 
        leave._id === id ? response.data.data : leave
      ));
    } catch (err) {
      console.error('Failed to update leave status', err);
    }
  };

  const handleDeleteLeave = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave record?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/v1/leaves/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setLeaves(leaves.filter(leave => leave._id !== id));
      } catch (err) {
        console.error('Failed to delete leave', err);
      }
    }
  };

  const handleAddLeaveSuccess = (newLeave) => {
    setLeaves([...leaves, newLeave]);
    setIsModalOpen(false);
  };

  const handleUpdateLeaveSuccess = (updatedLeave) => {
    setLeaves(leaves.map(leave => 
      leave._id === updatedLeave._id ? updatedLeave : leave
    ));
    setIsModalOpen(false);
    setSelectedLeave(null);
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
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Button 
            variant="purple" 
            onClick={() => {
              setSelectedLeave(null);
              setIsModalOpen(true);
            }}
          >
            <Calendar size={16} style={{ marginRight: '8px' }} />
            Create Leave
          </Button>
        </div>
      </div>

      <div className="leaves-layout">
        <div className="leaves-table-container">
          {loading ? (
            <div className="loading">Loading leaves...</div>
          ) : (
            <table className="leaves-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Type</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map(leave => (
                  <tr key={leave._id}>
                    <td>
                      <div className="employee-profile">
                        <div className="profile-avatar">
                          {leave.employee?.name?.charAt(0) || 'E'}
                        </div>
                        <span>{leave.employee?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td>{format(new Date(leave.startDate), 'MMM dd, yyyy')}</td>
                    <td>{format(new Date(leave.endDate), 'MMM dd, yyyy')}</td>
                    <td>{leave.type}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span className={`status-badge ${leave.status.toLowerCase()}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button className="dropdown-toggle">
                          <MoreVertical size={18} />
                        </button>
                        <div className="dropdown-menu-leaves">
                          <button onClick={() => {
                            setSelectedLeave(leave);
                            setIsModalOpen(true);
                          }}>
                            <Edit size={14} /> Edit
                          </button>
                          {(user.role === 'HR' || user.role === 'admin') && (
                            <select 
                              value={leave.status} 
                              onChange={(e) => handleStatusChange(leave._id, e.target.value)}
                              className={`status-select ${leave.status.toLowerCase()}`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          )}
                          {leave.documents?.length > 0 && (
                            <a 
                              href={`http://localhost:5000/api/v1/leaves/${leave._id}/documents/${leave.documents[0]}`}
                              download
                              className="download-link"
                            >
                              <Download size={14} /> Download
                            </a>
                          )}
                          <button 
                            onClick={() => handleDeleteLeave(leave._id)} 
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
          )}
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
                if (leave.status !== 'Approved') return false;
                return isWithinInterval(day, { 
                  start: new Date(leave.startDate), 
                  end: new Date(leave.endDate) 
                });
              });
              
              return (
                <div 
                  key={day} 
                  className={`calendar-day ${dayLeaves.length > 0 ? 'has-leave' : ''}`}
                >
                  <div className="day-number">{format(day, 'd')}</div>
                  {dayLeaves.map(leave => (
                    <div key={leave._id} className="leave-event">
                      {leave.employee?.name || 'Unknown'}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLeave(null);
        }}
        title={selectedLeave ? `Edit Leave` : 'Create New Leave'}
      >
        <LeaveForm 
          leave={selectedLeave}
          onSubmitSuccess={selectedLeave ? handleUpdateLeaveSuccess : handleAddLeaveSuccess}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedLeave(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default LeavesPage;