import { useState } from 'react';
import axios from 'axios';
import Button from '../Button/Button';
import './CandidateForm.css';

const CandidateForm = ({ onSubmitSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    status: 'New',
    experience: '',
  });
  const [resume, setResume] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  if (!formData.name || !formData.email || !formData.phone || !formData.position || !formData.experience) {
    setError('Please fill all required fields');
    setLoading(false);
    return;
  }

  if (!resume) {
    setError('Please upload a resume');
    setLoading(false);
    return;
  }

  const data = new FormData();
  data.append('name', formData.name);
  data.append('email', formData.email);
  data.append('phone', formData.phone);
  data.append('position', formData.position);
  data.append('status', formData.status);
  data.append('experience', formData.experience);
  data.append('resume', resume); // Uncomment this line

  try {
    const token = localStorage.getItem('token'); 
    const response = await axios.post('http://localhost:5000/api/v1/candidates', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      },
    });
    // console.log('Candidate created:', response.data.data);
    onSubmitSuccess(response.data.data);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to create candidate');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="candidate-form-container">
      <form onSubmit={handleSubmit} className="candidate-form">
        {error && <p className="form-error-candidate">{error}</p>}
        <div className="form-group-candidate">
          <label>Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter candidate name"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group-candidate">
          <label>Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter candidate email"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group-candidate">
          <label>Phone Number*</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group-candidate">
          <label>Position*</label>
          <select
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            required
            disabled={loading}
          >
            <option value="">Select Position</option>
            <option value="Human Resource Lead">Human Resource Lead</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Designer">Designer</option>
          </select>
        </div>
        <div className="form-group-candidate">
          <label>Experience (years)*</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            placeholder="Enter years of experience"
            required
            min="0"
            step="0.5"
            disabled={loading}
          />
        </div>
        <div className="form-group-candidate">
          <label>Resume*</label>
          <input 
            type="file" 
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            disabled={loading}
          />
          <small>PDF or Word documents only</small>
        </div>
        <div className="form-actions-candidate">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="purple"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm;