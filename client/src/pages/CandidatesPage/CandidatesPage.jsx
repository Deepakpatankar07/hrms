import { useState } from 'react';
import Header from '../../components/Header/Header.jsx';
import SearchBar from '../../components/SearchBar/SearchBar.jsx';
import Filter from '../../components/Filter/Filter.jsx';
import Button from '../../components/Button/Button.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import CandidateForm from '../../components/CandidateForm/CandidateForm.jsx';
import { MoreVertical, Download, Trash2, UserCheck } from 'react-feather';
import './CandidatesPage.css';

const CandidatesPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidates, setCandidates] = useState([
    { 
      id: '01',
      name: 'Jacob William', 
      email: 'jacob.william@example.com', 
      phone: '(252) 555-0111',
      position: 'Senior Developer',
      status: 'New',
      experience: 1.5,
      resume: 'jacob-william-resume.pdf'
    },
    { 
      id: '02',
      name: 'Guy Hawkins', 
      email: 'kenzil.awson@example.com', 
      phone: '(907) 555-0101',
      position: 'Human Resource Lead',
      status: 'New',
      experience: 3,
      resume: 'guy-hawkins-resume.pdf'
    },
    { 
      id: '03',
      name: 'Artene McCoy', 
      email: 'artene.mccoy@example.com', 
      phone: '(302) 555-0107',
      position: 'Full Time Designer',
      status: 'Selected',
      experience: 2,
      resume: 'artene-mccoy-resume.pdf'
    },
    { 
      id: '04',
      name: 'Leslie Alexander', 
      email: 'willie.jennings@example.com', 
      phone: '(207) 555-0119',
      position: 'Full Time Developer',
      status: 'Rejected',
      experience: 0,
      resume: 'leslie-alexander-resume.pdf'
    },
  ]);

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'New', label: 'New' },
    { value: 'Selected', label: 'Selected' },
    { value: 'Rejected', label: 'Rejected' },
  ];

  const positionOptions = [
    { value: '', label: 'All Positions' },
    { value: 'Senior Developer', label: 'Senior Developer' },
    { value: 'Human Resource Lead', label: 'Human Resource Lead' },
    { value: 'Full Time Designer', label: 'Full Time Designer' },
    { value: 'Full Time Developer', label: 'Full Time Developer' },
  ];

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(search.toLowerCase()) || 
                         candidate.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || candidate.status === statusFilter;
    const matchesPosition = !positionFilter || candidate.position.includes(positionFilter);
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const handleDownloadResume = (candidateId) => {
    // In a real app, this would download the resume file
    const candidate = candidates.find(c => c.id === candidateId);
    alert(`Downloading resume: ${candidate.resume}`);
  };

  const handleDeleteCandidate = (candidateId) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      setCandidates(candidates.filter(candidate => candidate.id !== candidateId));
    }
  };

  const handleConvertToEmployee = (candidateId) => {
    const candidate = candidates.find(c => c.id === candidateId);
    
    // In a real app, this would call your backend API
    console.log('Converting to employee:', candidate);
    
    // Mock API call
    setTimeout(() => {
      alert(`Candidate ${candidate.name} has been converted to employee successfully!`);
      // Remove the candidate from the list
      setCandidates(candidates.filter(c => c.id !== candidateId));
    }, 1000);
  };

  const handleStatusChange = (candidateId, newStatus) => {
    setCandidates(candidates.map(candidate => {
      if (candidate.id === candidateId) {
        return { ...candidate, status: newStatus };
      }
      return candidate;
    }));

    // If status changed to "Selected", prompt to convert to employee
    if (newStatus === 'Selected') {
      setTimeout(() => {
        if (window.confirm('Convert this candidate to employee?')) {
          handleConvertToEmployee(candidateId);
        }
      }, 100);
    }
  };

  const handleAddCandidateSuccess = (newCandidate) => {
    // In a real app, this would come from your API response
    const candidateToAdd = {
      ...newCandidate,
      id: String(candidates.length + 1).padStart(2, '0'),
      phone: '(xxx) xxx-xxxx', // Default phone
      experience: 0, // Default experience
      resume: 'new-resume.pdf' // Default resume filename
    };
    setCandidates([...candidates, candidateToAdd]);
    setIsModalOpen(false);
  };

  return (
    <div className="main-content">
      <Header title="Candidates" />
      
      <div className="candidates-filters">

        <div className="filter-group">
          <Filter
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Filter
            label="Position"
            options={positionOptions}
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
          />
          <SearchBar 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search by name or email"
          />
        </div>


        
        <Button variant='purple' onClick={() => setIsModalOpen(true)}>Add Candidate</Button>
      </div>
      
      <div className="candidates-table-container">
        <table className="candidates-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Candidate Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Status</th>
              <th>Experience (years)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map(candidate => (
              <tr key={candidate.id}>
                <td>{candidate.id}</td>
                <td>{candidate.name}</td>
                <td>{candidate.email}</td>
                <td>{candidate.phone}</td>
                <td>{candidate.position}</td>
                <td>
                  <select 
                    value={candidate.status}
                    onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                    className={`status-select ${candidate.status.toLowerCase()}`}
                  >
                    <option value="New">New</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td>{candidate.experience}</td>
                <td>
                  <div className="dropdown">
                    <button className="dropdown-toggle">
                      <MoreVertical size={18} />
                    </button>
                    <div className="dropdown-menuu">
                      <button onClick={() => handleDownloadResume(candidate.id)}>
                        <Download size={14} /> Download Resume
                      </button>
                      {candidate.status === 'Selected' && (
                        <button onClick={() => handleConvertToEmployee(candidate.id)}>
                          <UserCheck size={14} /> Convert to Employee
                        </button>
                      )}
                      <button onClick={() => handleDeleteCandidate(candidate.id)} className="delete">
                        <Trash2 size={14} /> Delete Candidate
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Add New Candidate"
      >
        <CandidateForm 
          onSubmitSuccess={handleAddCandidateSuccess} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default CandidatesPage;