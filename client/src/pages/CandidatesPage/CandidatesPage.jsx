import { useState, useEffect } from "react";
import Header from "../../components/Header/Header.jsx";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import Filter from "../../components/Filter/Filter.jsx";
import Button from "../../components/Button/Button.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import CandidateForm from "../../components/CandidateForm/CandidateForm.jsx";
import { MoreVertical, Download, Trash2, UserCheck } from "react-feather";
import axios from "axios";
import "./CandidatesPage.css";

const CandidatesPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/v1/candidates"
      );
      setCandidates(response.data.candidates || response.data.data || []);
    } catch (err) {
      // setError(err.response?.data?.message || 'Failed to fetch candidates');
      console.error("Error fetching candidates:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCandidates();
  }, []);

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "New", label: "New" },
    { value: "Selected", label: "Selected" },
    { value: "Rejected", label: "Rejected" },
  ];

  const positionOptions = [
    { value: "", label: "All Positions" },
    { value: "Senior Developer", label: "Senior Developer" },
    { value: "Human Resource Lead", label: "Human Resource Lead" },
    { value: "Full Time Designer", label: "Full Time Designer" },
    { value: "Full Time Developer", label: "Full Time Developer" },
  ];

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(search.toLowerCase()) ||
      candidate.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || candidate.status === statusFilter;
    const matchesPosition =
      !positionFilter || candidate.position.includes(positionFilter);
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const handleDownloadResume = async (candidateId) => {
    try {
      const candidate = candidates.find((c) => c._id === candidateId);
      const response = await axios.get(
        `/api/v1/candidates/${candidateId}/resume`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", candidate.resume);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to download resume");
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/v1/candidates/${candidateId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCandidates(
          candidates.filter((candidate) => candidate.id !== candidateId)
        );
        fetchCandidates();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete candidate");
      }
    }
  };

  const handleConvertToEmployee = async (candidateId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/candidates/move-to-employee/${candidateId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(`Candidate has been converted to employee successfully!`);
      setCandidates(candidates.filter((c) => c.id !== candidateId));
      fetchCandidates(); 
    } catch (err) {
      alert(err.response?.data?.message || "Failed to convert candidate");
    }
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/v1/candidates/${candidateId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCandidates(
        candidates.map((candidate) => {
          if (candidate.id === candidateId) {
            return { ...candidate, status: newStatus };
          }
          return candidate;
        })
      );

      if (newStatus === "Selected") {
        setTimeout(() => {
          if (window.confirm("Convert this candidate to employee?")) {
            handleConvertToEmployee(candidateId);
          }
        }, 100);
      }
      fetchCandidates();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleAddCandidateSuccess = (newCandidate) => {
    setCandidates([...candidates, newCandidate]);
    setIsModalOpen(false);
  };

  if (loading && candidates.length === 0) {
    return <div className="main-content">Loading candidates...</div>;
  }

  if (error) {
    return <div className="main-content">Error: {error}</div>;
  }

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
        <Button variant="purple" onClick={() => setIsModalOpen(true)}>
          Add Candidate
        </Button>
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
            {filteredCandidates.map((candidate, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{candidate.name}</td>
                <td>{candidate.email}</td>
                <td>{candidate.phone}</td>
                <td>{candidate.position}</td>
                <td>
                  <select
                    value={candidate.status}
                    onChange={(e) =>
                      handleStatusChange(candidate._id, e.target.value)
                    }
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
                      <button
                        onClick={() => handleDownloadResume(candidate._id)}
                      >
                        <Download size={14} /> Download Resume
                      </button>
                      {candidate.status === "Selected" && (
                        <button
                          onClick={() => handleConvertToEmployee(candidate._id)}
                        >
                          <UserCheck size={14} /> Convert to Employee
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCandidate(candidate._id)}
                        className="delete"
                      >
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
